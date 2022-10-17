var express = require("express");
var router = express.Router();

const { sendMsg, getMessages } = require("../controllers/MessageController");

router.route("/sendmsg").post(sendMsg);
router.route("/msgs/:channelId").get(getMessages);
module.exports = router;
