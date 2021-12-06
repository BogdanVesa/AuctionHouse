const express = require("express");
const router = express.Router();
const controller = require("../controllers/user");
const bodyParser = require("body-parser");
const auth = require("../middleware/auth");
// router.use(bodyParser.json());


router.post("/register",controller.registerUser);
router.post("/login",controller.loginUser);
router.post("/confirm",controller.confirmRegister);
router.post("/newKey",controller.generateNewKey);
router.post("/checkIfTemp",controller.checkIfTempUser);
router.get("/users",controller.getAllUsers);
router.get("/getUserInfo",auth,controller.getUserInfo);
router.get("/addBalance",auth,controller.addBalance)

module.exports = router;