const utils = require("../utils")
const addPostToBody = async (req,res,next) =>{
    let id=undefined;
    id=req.params?.postID;
    if(!id)
        id=req.body?.postID;
    if(id)
    {
        try{
            const post= await utils.findOneOrFail("post","postID",req.body.postID)
            req.post=post;
            next();          
        }catch(err){
            res.status(400).json({message:"the post doesn't exist"})
        }
    }
    else
        res.status(400).json({message:"postID was missing from request"})
    
}
module.exports = addPostToBody;