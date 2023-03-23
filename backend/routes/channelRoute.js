var express = require("express");
var router = express.Router();

const {
  createChannel,
  getChannelList,
  deleteChannel,
} = require("../controllers/ChannelController");

router.route("/createchannel").post(createChannel);
router.route("/channels/:id").get(getChannelList);
router.route("/deletechannel").post(deleteChannel);
module.exports = router;
