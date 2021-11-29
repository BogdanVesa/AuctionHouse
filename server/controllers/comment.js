const db = require("../config/db");
const utils = require("../utils");


const createComment = async (req,res) =>{
    try {
        if(!validateCommentData(req.body.content))
            res.status(400).json({message: "comment was too short or invalid"})
        else if(! await checkIfPostExists(req.params.postID))
            res.status(400).json({message: "the post you tried to comment on no longer exists"})
        else
        {
            const result = await utils.insert("comment",["postID","userID","content"],[req.params.postID,req.userID,req.body.content]);
            res.status(200).json({message: "comment posted succesfully"});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "failed to post comment"})
    }
}


const getComments = async (req,res) =>{
    try {
        if(! await checkIfPostExists(req.params.postID))
            res.status(400).json({message: "the post you tried to get comments for no longer exists"})
        else
        {
            const result = await utils.findByField("comment","postID",req.params.postID);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "failed to get comments"})
    }
}

const validateCommentData = (content) => {
    if(content === undefined || content.length < 5 || content.trim() === "")
        return false
    return true;
}

const checkIfPostExists = async (id) =>{
    // try {
    //     const post = await utils.findByField("post","postID",id)
    //     if(post === undefined || post.length === 0)
    //         return false;
    //     return true;
    // } catch (err) {
    //     console.log(err)
    //     return false
    // }
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

const deleteComment = async(req,res) =>{
    try {
    const comment = await utils.findByField("comment","commentID",req.params.commentID)
    const post = await utils.findByField("post","postID",comment[0].postID)
    if(comment && comment.length > 0)
    {
        if(req.userID == comment[0].userI || req.userID == post[0].ownerID)
        {
            const result = await utils.deleteQueryBuilder("comment",[{
                operator:"=",
                field:"commentID",
                value:req.params.commentID
            }])
            res.status(200).json({message:"comment deleted successfully"})
        }
        else
            res.status(400).json({message:"you don't have the authorization to delete this comment"})
        
    }
  } catch (err) {
      console.log(err);
      res.status(500).json({message: "failed to delete post"})
  }
}

module.exports = {createComment,getComments,deleteComment}