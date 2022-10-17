var express = require("express");
var router = express.Router();

const {
  createChannel,
  getChannelList,
} = require("../controllers/ChannelController");

router.route("/createchannel").post(createChannel);
router.route("/channels/:id").get(getChannelList);
module.exports = router;
