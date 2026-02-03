const express = require("express");
const router = express.Router();
const authcontroller = require("./auth");
const Admincontroller = require("./Admin");
const teachercontroller = require("./teacher");
const studentcontroller = require("./student");


router.use("/auth", authcontroller);
router.use("/Admin", Admincontroller);
router.use("/teacher", teachercontroller);
router.use("/student", studentcontroller);

module.exports = router;