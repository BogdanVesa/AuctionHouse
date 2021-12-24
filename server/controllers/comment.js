const db = require("../config/db").db;
const utils = require("../utils");

// const createComment = async (req,res) =>{
//     try {
//         if(!validateCommentData(req.body.content))
//             res.status(400).json({message: "comment was too short or invalid"})
//         else if(! await checkIfPostExists(req.params.postID))
//             res.status(400).json({message: "the post you tried to comment on no longer exists"})
//         else
//         {
//             const result = await utils.insert("comment",["postID","userID","content"],[req.params.postID,req.userID,req.body.content]);
//             const newComment = await getCommentsWithUsername(result.insertId);
//             res.status(200).json({newComment});
//         }
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({message: "failed to post comment"})
//     }
// }
const createComment = async (req,res) =>{
    try
    {   
        const result = await utils.insert("comment",["postID","userID","content"],[req.params.postID,req.userID,req.body.content]);
        const newComment = await getCommentsWithUsername(result.insertId);
        console.log(newComment)
        res.status(200).json({newComment});
    }catch (err){
        console.log(err);
        res.status(500).json({message: "failed to post comment"})
    }
}

const getCommentsWithUsername = async (commentID)=>{
    return new Promise((resolve,reject) =>{
        var sql = `select commentID,comment.userID,content,username,createdAt from comment inner join user on comment.userID = user.UserID where comment.commentID = ${commentID}`
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


const deleteComment = async(req,res) =>{
    try {

    const comment = await utils.findOneOrFail("comment","commentID",req.params.commentID)
    const post = await utils.findOneOrFail("post","postID",comment[0].postID)

    if(req.userID == comment[0].userID || req.userID == post[0].ownerID)
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

  } catch (err) {
      console.log(err);
      res.status(500).json({message: "failed to delete post"})
  }
}

module.exports = {createComment,deleteComment}