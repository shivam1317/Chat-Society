let express = require("express");
let router = express.Router();
const { addUser, getJoinedServers } = require("../controllers/UserController");

router.route("/adduser").post(addUser);
router.route("/getserver/:id").get(getJoinedServers);
module.exports = router;
