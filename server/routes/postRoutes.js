const express = require("express");
const router = express.Router();
const controller = require("../controllers/post");
const auth = require("../middleware/auth");

router.post("/createPost",auth,controller.createPost);
router.get("/getPosts",controller.getAllPosts);
router.get("/getImage/:postID",controller.getPostImage);
module.exports = router;