const db = require("../config/db");
const utils = require("../utils");
const tags = require("./tag");
const path = require("path");
const multer = require("multer");
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
                if(!validatePostData(data))
                    res.status(400).json({message: "all inputs must be valid"});
                else    
                {
                    const isoDate= new Date(data.endDate);
                    const mySQLDateString = isoDate.toJSON().slice(0, 19).replace('T', ' ');
                    const result = await utils.insert("post",['OwnerID',"currentPrice","endTime",'description'],[req.userID,Math.floor(data.price),mySQLDateString,data.description])
                    const tagInserts = data.tagList.map(el => {
                        utils.insert("post_tags",["postID","tag"],[result.insertId,el]);
                    })
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

 module.exports = {createPost,getAllPosts,getPostImage,checkIfPostExists}