const nodemailer = require("nodemailer");
require("dotenv").config();


let transporter = nodemailer.createTransport({
    host:"smtp-relay.sendinblue.com",
    port:587,
    secure:false,
    auth:{
        user:process.env.MAIL,
        pass:process.env.pass
    }
})

const sendMail = async (subject,mail,text) =>{
    try {
        await transporter.sendMail({
            from:`AuctionHouse staff <${process.env.MAIL}>`,
            to:mail,
            subject:subject,
            text:text
        })
        return 1;
    } catch (error) {
        console.log(err);
        return 0;
    }
}
const sendMailHTML = async (subject,mail,html) =>{
    try {
        const da = await transporter.sendMail({
            from:`AuctionHouse staff <${process.env.MAIL}>`,
            to:mail,
            subject:subject,
            text:"",
            html:html
        })
        // console.log(da);
        return 1;
    } catch (error) {
        console.log(err);
        return 0;
    }
}



const auctionWonMail = async (mail,id) =>{

    const html= `<div style="background-color:grey;text-align:center;padding:10px 10px 10px 10px;color:white;">
	<h3> Congrats! You just won an auction <h3>
 	<p>we hope you are enjoying the AuctionHouse experience so far</p>
 	<p> 
    	you can click on 
 		<a href ="http://localhost:3000/post/${id}"> this link </a>
       	to see the specified auction
    </p>
    <p>kind regards, the AuctionHouse Staff</p>
<div>`
    return new Promise(async (resolve,reject)=>{
        try {
           await transporter.sendMail({
                from:`AuctionHouse staff <${process.env.MAIL}>`,
                to:mail,
                subject:"auction won!",
                text:"",
                html:html
            })
            resolve(true)
        } catch (err) {
            console.log(err);
            reject(err)
        }
    })
}

const auctionSoldMail = async (mail,price,id) =>{

    const html= `<div style="background-color:grey;text-align:center;padding:10px 10px 10px 10px;color:white;">
	<h3> Congrats! You just sold an auction <h3>
    <p> ${price}$ should add to your balance shortly, use it wisely :) </p>
 	<p>we hope you are enjoying the AuctionHouse experience so far</p>
 	<p> 
    	you can click on 
 		<a href ="http://localhost:3000/post/${id}"> this link </a>
       	to see the specified auction
    </p>
    <p>kind regards, the AuctionHouse Staff</p>
<div>`
    return new Promise(async (resolve,reject)=>{
        try {
           await transporter.sendMail({
                from:`AuctionHouse staff <${process.env.MAIL}>`,
                to:mail,
                subject:"auction sold!",
                text:"",
                html:html
            })
            resolve(true)
        } catch (err) {
            console.log(err);
            reject(err)
        }
    })
}
const auctionHadNoBuyers = async (mail,id) =>{

    const html= `<div style="background-color:grey;text-align:center;padding:10px 10px 10px 10px;color:white;">
	<h3>Sadly, one of your auctions ended without a buyer :(  <h3>
    <p>maybe try to list your item again with a better photo and/or description to increase the likelyhood of people bidding on your post</p>
 	<p>we really hope you are enjoying the AuctionHouse experience so far though</p>
 	<p> 
    	you can click on 
 		<a href ="http://localhost:3000/post/${id}"> this link </a>
       	to see the specified auction
    </p>
    <p>kind regards, the AuctionHouse Staff</p>
<div>`
    return new Promise(async (resolve,reject)=>{
        try {
           await transporter.sendMail({
                from:`AuctionHouse staff <${process.env.MAIL}>`,
                to:mail,
                subject:"auction expired",
                text:"",
                html:html
            })
            resolve(true)
        } catch (err) {
            console.log(err);
            reject(err)
        }
    })
}
const accountCreatedMail = async (mail,key) =>{

    const html= `<div style="background-color:grey;text-align:center;padding:10px 10px 10px 10px;color:white;">
	<h3>Welcome to AuctionHouse !<h3>
    <p>We are glad to see you join our community :)</p>
 	<p>this ${key} is the key you should use in order to activate your account 
 	<p> 
    	you can click on 
 		<a href ="http://localhost:3000/post/${id}"> this link </a>
       	to see the specified auction
    </p>
    <p>kind regards, the AuctionHouse Staff</p>
<div>`
    return new Promise(async (resolve,reject)=>{
        try {
           await transporter.sendMail({
                from:`AuctionHouse staff <${process.env.MAIL}>`,
                to:mail,
                subject:"account confirmation",
                text:"",
                html:html
            })
            resolve(true)
        } catch (err) {
            console.log(err);
            reject(err)
        }
    })
}

const newKeyMail = async (mail,key) =>{

    const html= `<div style="background-color:grey;text-align:center;padding:10px 10px 10px 10px;color:white;">
	<h3>New confiramtion key </h3>
    <p>this ${key} is the new confirmation key you requested</p>
    <p>since you requested a new code that probably means you didn't recive our first mail, and we're  really sorry for the inconvenience
 	<p>this ${key} is the key you should use in order to activate your account 
 	<p> 
    	you can click on 
 		<a href ="http://localhost:3000/post/${id}"> this link </a>
       	to see the specified auction
    </p>
    <p>kind regards, the AuctionHouse Staff</p>
<div>`
    return new Promise(async (resolve,reject)=>{
        try {
           await transporter.sendMail({
                from:`AuctionHouse staff <${process.env.MAIL}>`,
                to:mail,
                subject:"Account Confirmation",
                text:"",
                html:html
            })
            resolve(true)
        } catch (err) {
            console.log(err);
            reject(err)
        }
    })
}
  
const outBidMail = async (mail,name,price,refund,id) =>{

    const html= `<div style="background-color:grey;text-align:center;padding:10px 10px 10px 10px;color:white;">
	<h3>${name} took your place as the highest bidder in an auction<h3>
    <p>The current price is ${price}$, your bid of ${refund}$ should be refunded shortly  </p>
 	<p> 
    	if you're willing to spend more money on that auction, you can simply click on 
 		<a href ="http://localhost:3000/post/${id}"> this link </a>
    </p>
    <p>kind regards, the AuctionHouse Staff</p>
<div>`
    return new Promise(async (resolve,reject)=>{
        try {
           await transporter.sendMail({
                from:`AuctionHouse staff <${process.env.MAIL}>`,
                to:mail,
                subject:"You've been outbid",
                text:"",
                html:html
            })
            resolve(true)
        } catch (err) {
            console.log(err);
            reject(err)
        }
    })
}

module.exports = {sendMail,sendMailHTML,auctionWonMail,auctionHadNoBuyers,auctionSoldMail,accountCreatedMail,newKeyMail,outBidMail};