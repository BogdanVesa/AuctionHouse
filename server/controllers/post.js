const db = require("../config/db");
const utils = require("../utils");
const tags = require("./tag");

const createPost = async (req,res) => {
    try{
        
        if(!validatePostData(req.body))
            res.status(400).json({message: "all inputs must be valid"});
        else    
        {
            const isoDate= new Date(req.body.endDate);
            const mySQLDateString = isoDate.toJSON().slice(0, 19).replace('T', ' ');
            const result = await utils.insert("post",['OwnerID',"currentPrice","endTime",'description'],[req.userID,req.body.price,mySQLDateString,req.body.description])
            const tagInserts = req.body.tagList.map(el => {
                utils.insert("post_tags",["postID","tag"],[result.insertId,el]);
            })
            Promise.all(tagInserts)
            .then(results =>{
                res.status(200).json({message: "post created sucesfully"});
            }).catch(err => {
                console.log(err);
                res.status(500).json({message: "failed to create post"});
            })
        }

    }catch(err){
        console.log(err);
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
    if(data.description == undefined || data.description.length < 20)
    {
        return false;
    }
    if(data.endDate == undefined || new Date(data.endDate).getTime() < currentTime)
    {
        return false;
    }
    return validateTags(data.tagList)
}
const validateTags = (tagList) =>{   
    const allowedTags = ['art','collectibles','electronics','furniture','vehicles']
    tagList.forEach(element => {
        if(!allowedTags.includes(element))
            return false;
    });
    return true
}
 module.exports = {createPost,getAllPosts}