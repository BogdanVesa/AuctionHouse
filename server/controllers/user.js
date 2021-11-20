const bcrypt = require("bcryptjs");
const db = require("../config/db").db;

const registerUser = async (req,res) => {
    try {
        if( !validateRegisterData(req.body))
            res.status(400).json({message: "all inputs must be valid"}) 
       if(! await emailExistsinDB(req.body.email))
       {
        pass = await encryptPass(req.body.password);
        db.query('INSERT INTO user (email, username, password) values (?,?,?)',[req.body.email, req.body.username, pass], (err,result) =>{
            if(err)
                {
                    res.status(500).json(err.message);
                    console.log(err.message);
                }
                res.status(200).json({message:"account created succesfully"});
        })
       }
       else
       {
           res.status(400).json({message: "this email was already used for creating an account"})
       }
    } catch (err) {
        console.log(err);
        res.status(400).json(err.message);
    }
}
const loginUser = async (req,res) => {
    try{
        if(!validateLoginData(req.body))
            res.status(400).json({message: "all inputs must be valid"});
        else
        {
            const user= await getUser(req.body.email);
            console.log(user);
            if(user.length !== 0 && (await bcrypt.compare(req.body.password,user[0].password)))
                res.status(200).json({message:"ok"})
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
    const user = await getUser(email);
    if(user.length === 0)
        return false
    return true;
}
const getUser =  (email) =>{
     return new Promise((resolve, reject) => {
         db.query("SELECT * FROM user WHERE email = ?",[email], (error, results) => {
             if(error) {
                 reject(error);
             }
             resolve(results);
         });
});
}
async function encryptPass(pass) {
    key = await bcrypt.hash(pass,10);  
    return key;
}
module.exports = {
    registerUser,
    getAllUsers,
    loginUser
}