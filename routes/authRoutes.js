const express = require("express");
const router = express.Router();

const { registerAPI, loginAPI } = require("../controller/authController");

router.post("/register", registerAPI);
router.post("/login", loginAPI);

module.exports = router;
