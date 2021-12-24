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

module.exports = {validateBidData}