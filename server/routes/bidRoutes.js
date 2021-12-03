const express = require("express");
const router = express.Router();
const controller = require("../controllers/bids");
const auth = require("../middleware/auth");
router.post("/",auth,controller.createBid);
module.exports = router;