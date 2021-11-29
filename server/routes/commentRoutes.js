const express = require("express");
const router = express.Router();
const controller = require("../controllers/comment");
const auth = require("../middleware/auth");

router.post("/:postID",auth,controller.createComment)
router.get("/:postID",auth,controller.getComments)
router.delete("/:commentID",auth,controller.deleteComment)


module.exports = router;