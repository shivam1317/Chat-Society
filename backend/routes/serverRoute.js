var express = require("express");
var router = express.Router();
const { getServerList, addServer } = require("../controllers/ServerController");

/* GET home page. */
router.route("/getserver").get(getServerList);
router.route("/createserver").post(addServer);

module.exports = router;
