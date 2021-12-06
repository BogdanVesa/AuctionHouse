const express = require("express");
const router = express.Router();
const controller = require("../controllers/bids");
const auth = require("../middleware/auth");
router.post("/",auth,controller.createBid);
router.get("/history",auth,controller.myHistory);
module.exports = router;