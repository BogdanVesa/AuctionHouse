require("dotenv").config();
const express = require("express");
const db = require("./config/db.js").db;
const users = require("./routes/userRoutes");
const tags = require("./routes/tagsRoutes");
const posts = require("./routes/postRoutes");
const comments = require("./routes/commentRoutes");
const bids = require("./routes/bidRoutes");
const app = express();
const cors = require("cors");
const utils = require("./utils");
app.use(express.json());
app.use(cors({
    origin: "*"
}));
app.use("/auth", users);
app.use("/posts",posts);
app.use("/comments",comments);
app.use("/bids",bids)
app.use(tags);


app.listen('3001',() => {
    console.log("Server started on port 3001");
})


