const utils = require("../utils")




const checkPrice = (req)=>{
    let s=""
    if(!req.body.hasOwnProperty("price"))
        return "price was missing from request\n"
    const price=parseInt(req.body.price);
    if(price > req.user.balance)
        s+= "you do not have enough balance to complete the payment\n"
    if(price <= req.post.currentPrice)
        s+= "you must bid atleast 1$ higher than the current price\n"   
    return s;
}
const validateBidTime = (deadline)=>{
    const now = new Date();
    const endTime = new Date(deadline);
    if(now.getTime() >= endTime.getTime())
        return "the post you tried to bid on already expired\n"
    return ""
}
const checkIfBiddable = (post,userID) =>
{
    if(userID === post.ownerID)
        return "You can't bid on your own Auction\n"
    if(userID === post.highestBidder)
        return "You are already the highest Bidder for this auction\n"
    return ""
}
const validateBidData =  (req,res,next) =>{
    let err=""
    err+=checkPrice(req)
    err+=validateBidTime(req.post.endTIme)
    err+=checkIfBiddable(req.post,req.userID)
    if(err!=="")
        res.status(400).json({message:err})
    else
        next();
}
const checkIfPostExists =  async (req,res,next) =>{
    let id;
    id=req.body?.postID;
    if(!id)
        id=req.params?.postID;
    if(!id)
        res.status(400).json("post id was missing from request");
    else
    {
        const post = await utils.checkIfRowExists("post",[{operator:"=",field:"postID",value:id}])
        if(post)
            next();
        else
            res.status(400).json({message:"post was not found"});

    }
}

const validateCommentData = (req,res,next) => {
    if(req.body?.content === undefined || req.body.content.length < 5 || req.body.content.trim() === "")
        res.status(400).json({message:"comment was to short or invalid"})
    else
        next();
}


module.exports = {validateBidData,checkIfPostExists,validateCommentData}