let express = require("express");
let router = express.Router();
const {
  addUser,
  getJoinedServers,
  getUserInfo,
} = require("../controllers/UserController");

router.route("/adduser").post(addUser);
router.route("/getserver/:id").get(getJoinedServers);
router.route("/getuser/:id").get(getUserInfo);
module.exports = router;
