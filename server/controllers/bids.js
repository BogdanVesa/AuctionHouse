const utils = require("../utils");
const checkIfPostExists = require("./post").checkIfPostExists;
const db = require("../config/db").db
const mailer = require("../config/nodemailer");
// const createBid = async (req,res) =>{
//     try{
//         if(req.body.hasOwnProperty("postID"))
//         {
//             const post = await utils.findByField("post","postID",req.body.postID)
//             console.log(post[0]);
//             if(post && post.length >0)
//             {
//                 if(post[0].ownerID !== req.userID && post[0].highestBidder !== req.userID )
//                 {
//                     const now = new Date();
//                     const endDate = new Date(post[0].endTIme);
//                     if(now.getTime() < endDate.getTime())
//                     {
//                         const price = Math.floor(req.body.price)
//                         if(price > post[0].currentPrice)
//                         {
//                             const user = await utils.findByField("user","UserID",req.userID)
//                             if(user[0].balance >= price)
//                             {
//                                 //update the post with the new price and highestBidderID
//                                 const result = await updatePost(Math.floor(req.body.price),post[0].postID,req.userID);
//                                 //check if a bid is already in db wby the same user for the same post, and update it , else create it
//                                 const oldBid = await utils.selectQueryBuilder("bid",["bidID","postID","userID","price"],[
//                                 {
//                                     operator:"=",
//                                     field:"postID",
//                                     value:post[0].postID
//                                 },
//                                 {
//                                     operator:"=",
//                                     field:"userID",
//                                     value:req.userID
//                                 }])
//                                 if(oldBid.length > 0)
//                                 {
//                                     const update =  await utils.updateQueryBuilder("bid",[{col:"price",val:req.body.price}])
//                                 }
//                                 else
//                                     {
//                                         const insert = await utils.insert("bid",["postID","userID","price"],[post[0].postID,req.userID,Math.floor(req.body.price)]);
//                                     }
//                                 res.status(200).json({message: "bidding succesful, you are currently the highest bidder"});
//                             }
//                             else
//                                 res.status(400).json({message: "you do not have enough money in your account right now to make this payment "})
//                         }
//                         else
//                         {
//                             res.status(400).json({message: "your bidding price must be atleast one unit of currency higher than the current highest bid"});
//                         }
//                     }
//                     else
//                     {
//                         res.status(400).json({message: "the auction you tried to bid on already ended"});
//                     }
//                 }
//                 else
//                 {
//                     res.status(400).json({message: "you are currently the highest bidder or it's your own auction"});
//                 }
//             }
//             else
//             {
//                 res.status(400).json({message: "the auction you tried to bid on no longer exists"})
//             }
//         }
    
//     }catch(err){
//         console.log(err);
//         res.status(500).json({message: "there was an error on creating your bid, try again"})
//     }

// }
const createBid = async(req,res)=>{    
    try {
        const price=Math.floor(parseInt(req.body.price))
        //update post currentPrice and highestBidder
        await utils.updateQueryBuilder("post",
            [{
                col:"currentPrice",
                val:price
            },
            {
                col:"highestBidder",
                val:req.userID
            }],
            [{operator:"=",field:"postID",value:req.post.postID}])
        //update user balance
        await utils.updateQueryBuilder("user",[{col:"balance",val:req.user.balance-price}],[{operator:"=",field:"UserID",value:req.userID}])

        //check if bid already exists in db, if so just update the price, else create it
        let oldBid = await utils.selectQueryBuilder("bid",["bidID","postID","userID","price"],
            [{
                operator:"=",
                field:"postID",
                value:req.post.postID
            },
            {
                operator:"=",
                field:"userID",
                value:req.userID
            }])
        if(oldBid && oldBid.length > 0)
        {
            oldBid = oldBid[0];
            await utils.updateQueryBuilder("bid",[{col:"price",val:price}],
                [{
                    operator:"=",
                    field:"postID",
                    value:req.post.postID
                },
                {
                    operator:"=",
                    field:"userID",
                    value:req.userID
                }])
        }
        else
        {
           await utils.insert("bid",["postID","userID","price"],[req.post.postID,req.userID,price]);
        }
        //if there was a previous highestBidder send them an outBid mail and refund their bid
        if(req.post.highestBidder!==null)
        {  
            const exHighestBidder = await utils.findOneOrFail("user","UserID",req.post.highestBidder)
            await mailer.outBidMail(exHighestBidder.email,req.user.username,price,req.post.currentPrice);
            await utils.updateQueryBuilder("user",[{col:"balance",val:exHighestBidder.balance+req.post.currentPrice}],[{operator:"=",field:"UserID",value:exHighestBidder.UserID}])
        }    
        res.status(200).json({message:"bidding succesfull, you are currently the highest bidder"});
    } catch (err) {
        console.log(err);
        res.status(400).json({message:"there was an error in creating your bid"})
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
