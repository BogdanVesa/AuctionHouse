const db = require("../config/db").db;
const utils = require("../utils");
const tags = require("./tag");
const path = require("path");
const multer = require("multer");
var cron = require("node-cron");
const mailer = require("../config/nodemailer");
const storage = multer.diskStorage({
    destination:"../images/",
    filename: async function(req,file,cb) {
        cb(null,''+Date.now()+path.extname(file.originalname));
    }
});

const upload = multer({
    storage:storage,
    fileFilter: async function(req,file,cb){
        //check extension
        const filetypes = ["jpeg","png","jpg","gif"];

        const extname = filetypes.includes((path.extname(file.originalname)).substring(1));

        const mimetype = filetypes.some(el => file.mimetype.includes(el))

        if(!extname || !mimetype)
            {
            //     // req.err="incorrect file type ";
                console.log(extname);
                console.log(mimetype);
                return cb("incorrect file type")
            }
        else
            {
                
                const data = JSON.parse(req.body.post)
                const validation =  validatePostData(data);
                if(!validation)
                    return cb("all inputs must be valid")
                else
                    return cb(null,true)
            }
    }
}).single("pic")

const createPost = async (req,res) => {
    try{
          upload(req,res, async function (err){
            if(err)
            {
                console.log(err);
                res.status(400).json({message:err});
            }

            else
            {
                const data = JSON.parse(req.body.post);
                // console.log(data.endDate)
                if(!validatePostData(data))
                    res.status(400).json({message: "all inputs must be valid"});
                else    
                {
                    const result = await utils.insert("post",['OwnerID',"currentPrice","endTime",'description'],[req.userID,Math.floor(data.price),data.endDate,data.description])
                    const tagInserts = data.tagList.map(el => {
                        utils.insert("post_tags",["postID","tag"],[result.insertId,el]);
                    })
                    cron.schedule(utils.dateToCronExpression(data.endDate), async () =>{
                        await determineAuctionOutcome(result.insertId);
                    });
                    Promise.all(tagInserts)
                    .then(async (results) =>{
                        const image = await utils.insert("image",["postID","filename"],[result.insertId,req.file.filename])
                        if(image)
                            res.status(200).json({message: "post created sucesfully"});
                        else
                            res.status(500).json({message: "there was an error with creating your post, try again"})
                    }).catch(err => {
                        console.log(err);
                        res.status(500).json({message: "failed to create post"});
                    })
                }
            }
        
        })
    }catch(err){
        console.log(err);
        res.status(400).json(err);
    }
}

const listsHaveIntersection = (l1,l2) =>{
    console.log(l1);
    console.log(l2);
    return l1.some(el => l2.includes(el));
}

const getAllPosts = async (req,res) => {
    const params = req.query;
    const conditions = [];
    if(params.hasOwnProperty("description"))
    {
        conditions.push({
            operator:"LIKE",
            field:"description",
            value:`%${params.description}%`
        })
    }

    //get all posts respecting conditions
    var posts = await utils.selectQueryBuilder("post",["postID","currentPrice","endTime","description"],conditions);


    //attach the list of tags  to the corresponding post for each post recieved
    for(i = 0; i < posts.length; i++)
    {
        const x = await utils.selectQueryBuilder("post_tags",["tag","post_tagID"],
        [{
            operator:"=",
            field:"postID",
            value:posts[i].postID
        }]);
        //reduce the list of rowPackets into a list of tags        
        posts[i]["tags"] = x.reduce((taglist,row) => {
            return [...taglist, row.tag];
        },[]);
    }
    //filter by tags
    if(params.hasOwnProperty("tags"))
    {
        posts = posts.filter(post => {
             return listsHaveIntersection(post.tags,params.tags)
        })
    }
    res.status(200).json(posts);
}


const validatePostData = (data) =>{
    const currentTime = (new Date).getTime();
    if(data.price == undefined || Number(data.price) <=0)
    {
        return false;
    }
    if(data.description == undefined || data.description.length < 10)
    {
        return false;
    }
    if(data.endDate == undefined || new Date(data.endDate).getTime() < currentTime)
    {
        return false;
    }
    return validateTags(data.tagList)
}

const getPostImage = async (req,res) =>{
    const params = req.params;
    if(params.hasOwnProperty("postID"))
    {
        try {
            const image = await utils.findByField("image","postID",params.postID)
            const imgFolder = path.dirname(path.dirname(__dirname));
            var options = {
                root:path.join(imgFolder,"images")
            }
            var filename = image[0].filename;
            
            res.status(200).sendFile(filename,options,(err) =>{
                if(err)
                {
                    console.log(err)
                }
            })
        } catch (err) {
            res.status(500).json(err);
        }   
    
    }
}
const validateTags = (tagList) =>{   
    const allowedTags = ['art','collectibles','electronics','furniture','vehicles']
    tagList.forEach(element => {
        if(!allowedTags.includes(element))
            return false;
    });
    return true
}

// const determineAuctionOutcome2 =  async(id)=>{
//     try {
//         // console.log("intra in functie");
//         var post = await utils.findByField("post","postID",id);
//         if(post && post.length!==0)
//         {
//             post = post[0];
//             // console.log(post);
//             var owner  = await utils.findByField("user","UserID",post.ownerID);
//             owner = owner[0];
//             if(post.highestBidder === null)
//             {
//                 let html = `<h2> Sadly one of your auctions has ended without a buyer</h2>
//                 <p>maybe try to list it again with a better photo and description to increase the likelyhood of people being interested</p>
//                 <a href="http://localhost:3000/posts">(to be implemented)</a>`    
//                 const mail = await mailer.sendMailHTML("auction result",owner.email,html);
//                 if(mail === 1)
//                     console.log("ok");
//                 else
//                     console.log("not ok");
//             }
//             else
//                 console.log("are un bidder"); 
//         }
//         else
//             console.log("nu exista post ul");
//     } catch (err) {
//         console.log(err);
//     }
// }

const determineAuctionOutcome =  async(id)=>{
    try {
        let html
        // console.log("intra in functie");
        var post = await utils.findByField("post","postID",id);
        if(post && post.length > 0)
        {
            post = post[0];
            // console.log(post);
            var owner  = await utils.findByField("user","UserID",post.ownerID);
            owner = owner[0];
            if(post.highestBidder === null)
            {
              await mailer.auctionHadNoBuyers(owner.email,post.postID)
            }
            else
            {
                var buyer = await utils.findByField("user","UserID",post.highestBidder)
                if(buyer && buyer.length > 0){
                    buyer = buyer[0];
                    const updateSellerBalance = await utils.updateQueryBuilder("user",[{col:"balance",val:(owner.balance+post.currentPrice)}],[{operator:"=",field:"UserID",value:owner.UserID}]);
                    const sendMailToBuyer = await mailer.auctionWonMail(buyer.email,post.postID);
                    const sendMailToSeller = await mailer.sendMailHTML("auction result",owner.email,`<h2>you just sold an auction!</h2>
                    <p> ${post.currentPrice}$ should enter your account shortly</p>
                    <p>kind regards, AuctionHouse staff</p>`)
                }
                else
                {
                    console.log("buyer was not found");
                }
            } 
        }
        else
            res.status(500).json({message:"the post does not exist"});
    } catch (err) {
        console.log(err);
    }
}
const getSpecificPost = async (req,res) =>{
  try{
    
    if(req.params.hasOwnProperty("id"))
    {
        var post = await utils.findByField("post","postID",req.params.id);
        if(post && post.length > 0)
        {
            post = post[0];
            var tags = await utils.findByField("post_tags","postID",post.postID);
            tags = tags.reduce((prev,curr)=>{
                return [...prev,curr.tag]
            },[])
            post["tags"] = tags;
            var comments = await getCommentsWithUsername(post.postID)
            post["comments"] = comments
            res.status(200).json(post);
        }
        else
            res.status(400).json({message: "post was not found"});
    }
    else
        res.status(500).json({message:"post info couldn;t be retrieved, try again later"});
  }catch(err){
    console.log(err)
    res.status(500).json({message:"post info couldn;t be retrieved, try again later"});
  }
}
const getCommentsWithUsername = async (postID)=>{
    return new Promise((resolve,reject) =>{
        var sql = `select commentID,comment.userID,content,username,createdAt from comment inner join user on comment.userID = user.UserID where comment.postID = ${postID}`
        db.query(sql,(err,result)=>{
            if(err)
            {
                console.log(err);
                reject(err);
            }
            resolve(result);
        })
    })    
} 

const checkIfPostExists = async (id) =>{
    return new Promise( async (resolve,reject) =>{
        try {
            const post = await utils.findByField("post","postID",id)
            if(post && post.length>0)
                resolve(true);
            resolve(false)
        } catch (err) {
           reject(err) 
        }
    })
}

 module.exports = {createPost,getAllPosts,getPostImage,checkIfPostExists,determineAuctionOutcome,getSpecificPost}