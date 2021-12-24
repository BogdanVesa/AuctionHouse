const express = require("express");
const router = express.Router();
const controller = require("../controllers/bids");
const auth = require("../middleware/auth");
const getUser = require("../middleware/getUser");
const getPost = require("../middleware/getPost");
const validator = require("../middleware/validators")
router.post("/",auth,getUser,getPost,validator.validateBidData,controller.createBid);
router.get("/history",auth,controller.myHistory);
module.exports = router;