const bcrypt = require("bcryptjs");
const db = require("../config/db");
const jwt = require("jsonwebtoken");
const utils = require("../utils");
const nodemailer = require("../config/nodemailer");
require("dotenv").config();

const registerUser = async (req,res) => {
    try {
        if( !validateRegisterData(req.body))
            res.status(400).json({message: "all inputs must be valid"}) 
        else
        {
            if(! await emailExistsinDB(req.body.email))
            {
                const pass = await encryptPass(req.body.password);
                const key =  generateConfirmationKey();
                result = await utils.insert("user_temp",["email","username","password","confirmationKey"],[req.body.email,req.body.username,pass,key]);
                const mail = await nodemailer.sendMail("account confirmation",req.body.email,`use this code: ${key} to activate your account, happy auctioning :)`);
                if(mail === 1)
                {
                    res.status(200).json({message:"account created succesfully, check your email account for the confirmation key"})
                }
                else
                    res.status(500).json({message:"there was an error in sending the confirmation key to your email"})

            }        
            else
            {
                res.status(400).json({message: "this email was already used for creating an account"})
            }
        }
    } catch (err) {
        console.log(err);
    }
}
const confirmRegister = async (req,res) =>{
  try{
    if(req.body.hasOwnProperty("email") && req.body.hasOwnProperty("key"))
    {
        var user = await utils.findByField("user_temp","email",req.body.email);
        if(user.length > 0)
        {
            user = user[0];
            if(req.body.key === user.confirmationKey)
            {
                const insert = await utils.insert("user",["email","username","password"],[user.email,user.username,user.password])
                const del = await utils.deleteQueryBuilder("user_temp",[{operator:"=",field:"id",value:user.id}])
                res.status(200).json({message:"account confirmation successfull"})
            }
            else
            {
                res.status(400).json({message: "confirmation key was incorrect, try again"});
            }
        }
        else
            res.status(400).json({message:"account was not found"});
    }
    else{
        res.status(400).json({message:"essential data was missing in the confirmation request"});
    }
    
  }catch(err){
    console.log(err);
    res.status(500).json({message:"account confirmation failed, try again"})
  }
}
const generateNewKey = async (req, res) =>{
    try{
        if(req.body.hasOwnProperty("email"))
        {
            var user = await utils.findByField("user_temp","email",req.body.email);
            if(user.length > 0)
            {
                const key = generateConfirmationKey();
                const result = await utils.updateQueryBuilder("user_temp",[{col:"confirmationKey",val:key}],[{
                    operator:"=",
                    field:"email",
                    value:req.body.email
                }])
                const mail = await nodemailer.sendMail("new confirmation code",req.body.email,`this is the new confirmation code your requested: ${key}, happy auctioning :)`);
                res.status(200).json({messae:"new confirmation key was generated"})
            }
            else
                res.status(400).json({message: "account was not found"});
        }
        else
            res.status(400).json({message: "email was missing in the request"});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"could not generate new key, try again"})
    }
}
const loginUser = async (req,res) => {
    try{
        if(!validateLoginData(req.body))
            res.status(400).json({message: "all inputs must be valid"});
        else
        {
            const user = await utils.findByField("user","email",req.body.email);
            if(user && user.length > 0)
            {
               const id = user[0].UserID;
               if(user.length !== 0 && (await bcrypt.compare(req.body.password,user[0].password)))
               {
                   const token = jwt.sign({id}, process.env.SECRET, {
                       expiresIn:86400
                   })
                   res.status(200).json({auth:true, token:token});
               }
               else
                   res.status(400).json({message:"incorect password or the account doesn't exist"})
            }
            else
                res.status(400).json({message:"this account doesn't exist"});
        }  
    }catch(err) {
        console.log(err);
        res.status(500).json(err.message);
    }
}
const getAllUsers = (req,res) => {
    try {
        let mysql ="select * from user"
        let query = db.query(mysql,(err,result) =>{
            if(err)
                throw err;
            console.log(result)
        })
    } catch (err) {
        console.log(err)
        res.status(400).json(err.message);
    }
}
const checkIfTempUser = async (req,res) =>{
    try {
        if(req.body.hasOwnProperty("email"))
        {
            const user = await utils.findByField("user_temp","email",req.body.email);
            if(user && user.length > 0)
            {
                res.status(200).json(true);
            }
            else
            {
                res.status(200).json(false);
            }
        }
        else
        {
            res.status(400).json({message: "email was missing from request"});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({message:"request failed"})
    }
}
const validateLoginData = (data) =>{
    if(data.email == undefined || data.email.length < 5 || !(data.email.includes("@")))
        return false;
    if(data.password == undefined || data.password.length < 5)
        return false;
    return true;
}

const validateRegisterData = (data)=>{


    if(data.email == undefined || data.email.length < 5 || !(data.email.includes("@")))
        return false;
    if(data.password == undefined || data.password.length < 5)
        return false;
    if(data.username == undefined || data.username.length < 5)
        return false;
    return true;
}
const emailExistsinDB = async (email)=>{
    const user = await utils.findByField('user','email',email)
    const user2 = await utils.findByField("user_temp",'email',email)
    if(user.length === 0 && user2.length === 0)
        return false
    return true;
}
const getUserInfo =  async (req,res) => {
    const user = await utils.findByField('user','UserID',req.userID);
    res.status(200).json(user);
}
async function encryptPass(pass) {
    key = await bcrypt.hash(pass,10);  
    return key;
}
function generateConfirmationKey()
{
    return Math.random().toString(36).substr(2, 5)
}
module.exports = {
    registerUser,
    getAllUsers,
    loginUser,
    getUserInfo,
    confirmRegister,
    generateNewKey,
    checkIfTempUser
}