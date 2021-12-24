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

const validateTags = (tagList) =>{   
    const allowedTags = ['art','collectibles','electronics','furniture','vehicles']
    tagList.forEach(element => {
        if(!allowedTags.includes(element))
            return false;
    });
    return true
}

const validatePostData = (data) =>{
    const now = new Date();
    const deadline = new Date(data.endDate);
    let err ="";
    if(data.price == undefined || Number(data.price) <=0)
        err+="price must be bigger than 0 \n"
    if(data.description == undefined || data.description.length < 5 || data.description.trim() === "")
        err+="description was too short or invalid \n"
    if(deadline == undefined || deadline.getTime() < now.getTime())
        err+="post endTime already passed or was invalid \n";
    if(!validateTags(data.tagList))
        err+="one or more tags were invalid \n";
    return err;
}

const upload = multer({
    storage:storage,
    fileFilter: async function(req,file,cb){
        //check extension
        const filetypes = ["jpeg","png","jpg","gif"];

        const extname = filetypes.includes((path.extname(file.originalname)).substring(1));

        const mimetype = filetypes.some(el => file.mimetype.includes(el))

        if(!extname || !mimetype)
            {
                console.log(extname);
                console.log(mimetype);
                return cb("incorrect file type")
            }
        else
            {
                //validate post data here to avoid storing files redundantly (if the data was not valid, the post was not created, therefor no need to store its image )
                const data = JSON.parse(req.body.post)
                const validation =  validatePostData(data);
                if(validation != "")
                    return cb(validation);
                else
                    return cb(null,true);
            }
    }
}).single("pic")

const createPost = async (req,res) => {
    upload(req,res, async function (err){
        if(err)
        {
            console.log(err);
            res.status(400).json({message:err});
        }
        else
        {
            const data = JSON.parse(req.body.post)
            if(req.file !== undefined || validatePostData(data) ==="")
            {
                //if there was a file in formdata, the post data was already validated in the multer file filter
                const result = await utils.insert("post",['OwnerID',"currentPrice","endTime",'description'],[req.userID,Math.floor(data.price),data.endDate,data.description])
                const tagInserts = data.tagList.map(el => {
                    utils.insert("post_tags",["postID","tag"],[result.insertId,el]);
                })
                cron.schedule(utils.dateToCronExpression(data.endDate), async () =>{
                    await determineAuctionOutcome(result.insertId);
                });
                Promise.all(tagInserts)
                .then(async (results) =>{
                    let filename="noImg.png";
                    if(req.file && req.file.filename)
                        filename = req.file.filename;
                    const image = await utils.insert("image",["postID","filename"],[result.insertId,filename])
                    if(image)
                        res.status(200).json({message: "post created sucesfully"});
                    else
                        res.status(500).json({message: "there was an error with creating your post, try again"})
                }).catch(err => {
                    console.log(err);
                    res.status(500).json({message: "failed to create post"});
                })
            }
            else
                res.status(400).json({message:validatePostData(data)});
        }
    })
}

const listsHaveIntersection = (l1,l2) =>{
 
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
    let posts = await utils.getPostsWithTags(conditions);
    posts = posts.map((el)=>{
        el["tags"] = el["tags"].split(",");
        return el;
    })
    //filter by posts
    if(params.hasOwnProperty("tags"))
    {
        posts = posts.filter(post => {
             return listsHaveIntersection(post.tags,params.tags)
        })
    }
    console.log(posts);
    res.status(200).json(posts);
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

const determineAuctionOutcome =  async(id)=>{
    try {
        let post = await utils.findOneOrFail("post","postID",id)
        let owner  = await utils.findOneOrFail("user","UserID",post.ownerID);
        if(post.highestBidder === null)
            await mailer.auctionHadNoBuyers(owner.email,post.postID)
        else
        {
           let buyer = await utils.findOneOrFail("user","UserID",post.highestBidder);
           const updateSellerBalance = await utils.updateQueryBuilder("user",[{col:"balance",val:(owner.balance+post.currentPrice)}],[{operator:"=",field:"UserID",value:owner.UserID}]);
           const sendMailToBuyer = await mailer.auctionWonMail(buyer.email,post.postID);
           const sendMailToSeller = await mailer.sendMailHTML("auction result",owner.email,`<h2>you just sold an auction!</h2>
           <p> ${post.currentPrice}$ should enter your account shortly</p>
           <p>kind regards, AuctionHouse staff</p>`)
        }   
    }catch (err){
        console.log(err);
        res.status(400).json({message:err});
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
const getSpecificPost = async (req,res) =>{
    try{
        //post is already added to the request by the getPost middleware
        let post = req.post;
        console.log(post);
        //add the tags to the response object
        var tags = await utils.findByField("post_tags","postID",post.postID);
        tags = tags.reduce((prev,curr)=>{
            return [...prev,curr.tag]
        },[])
        post["tags"] = tags;
        //add comments to the response object

        var comments = await getCommentsWithUsername(post.postID)
        post["comments"] = comments
        res.status(200).json(post);
    }catch(err){
      console.log(err)
      res.status(400).json({message:err});
    }
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