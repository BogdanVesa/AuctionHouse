const express = require("express");
const router = express.Router();
const controller = require("../controllers/user");
const bodyParser = require("body-parser");
// router.use(bodyParser.json());


router.post("/register",controller.registerUser);
router.post("/login",controller.loginUser);
router.get("/users",controller.getAllUsers);
module.exports = router;