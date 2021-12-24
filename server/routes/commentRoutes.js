const express = require("express");
const router = express.Router();
const controller = require("../controllers/comment");
const auth = require("../middleware/auth");
const validators = require("../middleware/validators");

router.post("/:postID", auth, validators.validateCommentData, validators.checkIfPostExists, controller.createComment)
router.delete("/:commentID",auth,controller.deleteComment)


module.exports = router;