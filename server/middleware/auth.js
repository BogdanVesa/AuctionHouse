const jwt = require("jsonwebtoken");

const config=process.env;

const auth = (req,res,next)=> {
    const token = req.headers["x-access-token"];
    if(!token)
    {
        return res.status(400).json({auth:false ,message:"access token is required"})
    }
    else
    {
        jwt.verify(token, config.SECRET, (err,decoded) => {
            if(err)
                res.status(400).json({auth:false, message: "authorization failed"})
            else
               {
                   req.userID = decoded.id;
                   next();
               }
        })
    }
}
module.exports = auth;