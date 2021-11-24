const db = require("../config/db");
const utils = require("../utils");

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


const getAllPosts = async (req,res) => {
    const posts = await utils.getAllRows("post",["postID","currentPrice","endTime","description"]);
    for(i = 0; i < posts.length; i++)
    {
        posts[i]["tags"] = await utils.getAllRowsWhere("post_tags",["tag","post_tagID"],"postID",posts[i]["postID"]);
    }
    res.status(200).json(posts);
}
const validatePostData = (data) =>{
    const currentTime = (new Date).getTime();
    if(data.price == undefined || Number(data.price) <=0)
    {
        console.log("price e baiu");
        return false;
    }
    if(data.description == undefined || data.description.length < 20)
    {
        console.log("description e baiu");
        return false;
    }
    if(data.endDate == undefined || new Date(data.endDate).getTime() < currentTime)
    {
        console.log("data e baiu");
        return false;
    }
    return validateTags(data.tagList)
}
const validateTags = (tagList) =>
{
    
    const allowedTags = ['art','collectibles','electronics','furniture','vehicles']
    tagList.forEach(element => {
        if(!allowedTags.includes(element))
            return false;
    });
    return true
}
 module.exports = {createPost,getAllPosts}