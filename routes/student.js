const express = require("express");
const router = express.Router();
const { StudentDashboard, createstudent, viewstudent, deletestudent,editstudent} = require("../controllers/controller");
const { auth, authorize } = require("../middleware/dashboard");


router.get('/dashboard', auth, authorize(["Admin", "teacher", "student"]), StudentDashboard);
router.post('/create', auth, authorize(["Admin", "teacher"]), createstudent);
router.get('/allstudent', auth, authorize(["Admin", "teacher"]), viewstudent);
router.put('/edit/:id', auth, authorize(["Admin", "teacher"]), editstudent);
router.delete('/delete/:id', auth, authorize(["Admin", "teacher"]), deletestudent);

module.exports = router;
