let express = require("express");
let router = express.Router();
const {
  addUser,
  getJoinedServers,
  getUserInfo,
  editUser,
} = require("../controllers/UserController");

router.route("/adduser").post(addUser);
router.route("/getserver/:id").get(getJoinedServers);
router.route("/getuser/:id").get(getUserInfo);
router.route("/updateuser").put(editUser);
module.exports = router;
