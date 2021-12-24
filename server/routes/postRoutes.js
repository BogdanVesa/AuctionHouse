const express = require("express");
const router = express.Router();
const controller = require("../controllers/post");
const auth = require("../middleware/auth");
const getPost = require("../middleware/getPost");

router.post("/createPost", auth, controller.createPost);
router.get("/getPosts", controller.getAllPosts);
router.get("/getImage/:postID", controller.getPostImage);
router.get("/:id", getPost, controller.getSpecificPost);
// router.post("/testing",controller.determineAuctionOutcome);
module.exports = router;