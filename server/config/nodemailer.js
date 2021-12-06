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

module.exports = {sendMail,sendMailHTML};