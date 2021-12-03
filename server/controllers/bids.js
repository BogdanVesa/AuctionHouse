const utils = require("../utils");
const checkIfPostExists = require("./post").checkIfPostExists;
const db = require("../config/db").db

const createBid = async (req,res) =>{
    try{
        if(req.body.hasOwnProperty("postID"))
        {
            const post = await utils.findByField("post","postID",req.body.postID)
            if(post && post.length >0)
            {
                if(post[0].ownerID !== req.userID )
                {
                    const now = new Date();
                    const endDate = new Date(post[0].endTIme);
                    if(now.getTime() < endDate.getTime())
                    {
                        if(Math.floor(req.body.price) > post[0].currentPrice)
                        {
                            const result = await updatePost(Math.floor(req.body.price),post[0].postID,req.userID);
                            const result2 = await utils.insert("bid",["postID","userID","price"],[post[0].postID,req.userID,Math.floor(req.body.price)]);
                            res.status(200).json({message: "bidding succesful, you are currently the highest bidder"});
                        }
                        else
                        {
                            res.status(400).json({message: "your bidding price must be atleast one unit of currency higher than the current highest bid"});
                        }
                    }
                    else
                    {
                        res.status(400).json({message: "the auction you tried to bid on already ended"});
                    }
                }
                else
                {
                    res.status(400).json({message: "you are currently the highest bidder or it's your own auction"});
                }
            }
            else
            {
                res.status(400).json({message: "the auction you tried to bid on no longer exists"})
            }
        }
    
    }catch(err){
        console.log(err);
        res.status(500).json({message: "there was an error on creating your bid, try again"})
    }

}

const updatePost = async (price,postID,userID) =>{
    return new Promise((resolve,reject)=>{
        var sql="UPDATE POST SET currentPrice = "+db.escape(price)+", highestBidder = "+db.escape(userID)+" where postID = "+db.escape(postID)
        db.query(sql,(err,result)=>{
            if(err)
            {
                console.log(err)
                reject(err);
            }
            resolve(result)
        
        })
    })
}
module.exports = {createBid}
