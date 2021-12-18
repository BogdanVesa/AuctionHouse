const utils = require("../utils")
const addPostToBody = async (req,res,next) =>{
    try{
        if(req.body.hasOwnProperty("postID")){
            const post= await utils.findOneOrFail("post","postID",req.body.postID)
            req.post=post;
            next();
        }
        else{
            res.status(400).json({message:"postID was missing from request"})
        }
        
    }catch(err){
        res.status(400).json({message:"the post doesn't exist"})
    }
}
module.exports = addPostToBody;