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
                if(post[0].ownerID !== req.userID && post[0].highestBidder !== req.userID )
                {
                    const now = new Date();
                    const endDate = new Date(post[0].endTIme);
                    if(now.getTime() < endDate.getTime())
                    {
                        const price = Math.floor(req.body.price)
                        if(price > post[0].currentPrice)
                        {
                            const user = await utils.findByField("user","UserID",req.userID)
                            if(user[0].balance >= price)
                            {
                                //update the post with the new price and highestBidderID
                                const result = await updatePost(Math.floor(req.body.price),post[0].postID,req.userID);
                                //check if a bid is already in db wby the same user for the same post, and update it , else create it
                                const oldBid = await utils.selectQueryBuilder("bid",["bidID","postID","userID","price"],[
                                {
                                    operator:"=",
                                    field:"postID",
                                    value:post[0].postID
                                },
                                {
                                    operator:"=",
                                    field:"userID",
                                    value:req.userID
                                }])
                                if(oldBid.length > 0)
                                {
                                    const update =  await utils.updateQueryBuilder("bid",[{col:"price",val:req.body.price}])
                                }
                                else
                                    {
                                        const insert = await utils.insert("bid",["postID","userID","price"],[post[0].postID,req.userID,Math.floor(req.body.price)]);
                                    }
                                res.status(200).json({message: "bidding succesful, you are currently the highest bidder"});
                            }
                            else
                                res.status(400).json({message: "you do not have enough money in your account right now to make this payment "})
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
const myHistory = async (req,res) =>{
   try{
    const myPosts =  await utils.selectQueryBuilder("post",["postID","ownerID","highestBidder","currentPrice","endTime","description"],[{operator:"=",field:"ownerID",value:req.userID}]);
    const myBids =  await getAllBids(req.userID);
    const result ={
        myPosts,
        myBids
    }
    res.status(200).json(result);
   }catch(err){
   res.status(500).json(err);
   }

}

const getAllBids= (userID) =>{
    var sql = `select post.postID,ownerID,highestBidder,currentPrice,endTime,description,price from post inner join bid on post.postID = bid.postID where userID = ${userID}`
    return new Promise((resolve,reject)=>{
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
module.exports = {createBid,myHistory}
