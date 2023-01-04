var express = require("express");
var router = express.Router();
const {
  getServerList,
  addServer,
  joinServer,
} = require("../controllers/ServerController");

/* GET home page. */
router.route("/getserver").get(getServerList);
router.route("/createserver").post(addServer);
router.route("/joinserver").post(joinServer);

module.exports = router;
