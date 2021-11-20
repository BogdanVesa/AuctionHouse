require("dotenv").config();
const express = require("express");
const db = require("./config/db.js").db;
const users = require("./routes/userRoutes")
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000"
}));
app.use("/auth", users);

// app.use(function (req, res , next){
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// })
app.listen('3001',() => {
    console.log("Server started on port 3001");
})


