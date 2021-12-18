const utils = require("../utils")
const addUserToBody = async (req,res,next) =>{
    try{
        const user= await utils.findOneOrFail("user","UserID",req.userID)
        req.user = user;
        next();
    }catch(err){
        res.status(400).json({message:"authorization failed, user couldn't be found"})
    }
}
module.exports = addUserToBody;