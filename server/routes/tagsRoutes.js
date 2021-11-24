const express = require("express");
const router = express.Router();
const controller = require("../controllers/tag");
//const auth = require("../middleware/auth");

router.get("/allTags",controller.getAllTags)
module.exports = router;