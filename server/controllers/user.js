const bcrypt = require("bcryptjs");
const db = require("../config/db");
const jwt = require("jsonwebtoken");
const utils = require("../utils");
require("dotenv").config();

const registerUser = async (req,res) => {
    try {
        if( !validateRegisterData(req.body))
            res.status(400).json({message: "all inputs must be valid"}) 
        else
        {
            if(! await emailExistsinDB(req.body.email))
            {
                pass = await encryptPass(req.body.password);
                result = await utils.insert("user",["email","username","password"],[req.body.email,req.body.username,pass]);
                if(result)
                    res.status(200).json({message : "account created succesfully"});
                else
                    res.status(500).json({message : "account creation failed"});
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
const loginUser = async (req,res) => {
    try{
        if(!validateLoginData(req.body))
            res.status(400).json({message: "all inputs must be valid"});
        else
        {
            const user = await utils.findByField("user","email",req.body.email);
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
    if(user.length === 0)
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
module.exports = {
    registerUser,
    getAllUsers,
    loginUser,
    getUserInfo
}