const express = require("express");
const router = express.Router();
const UserCtrl = require("../controller/UserCtrl");

router.get("/user/login", UserCtrl.login);
router.post("/user/login", UserCtrl.enter);
router.get("/logout", UserCtrl.logout);
router.get("/register", UserCtrl.register);
router.post("/register/success", UserCtrl.create);

module.exports = router;
