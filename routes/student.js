const express = require("express");
const router = express.Router();
const { StudentDashboard, createstudent, viewstudent, deletestudent, editstudent, viewallstudent, attendence } = require("../controllers/controller");
const { auth, authorize } = require("../middleware/dashboard");


router.get('/dashboard', auth, authorize(["Admin", "teacher", "student"]), StudentDashboard);
router.post('/create', auth, authorize(["Admin", "teacher"]), createstudent);
router.get('/allstudent', auth, authorize(["Admin", "teacher"]), viewstudent);
router.put('/edit/:id', auth, authorize(["Admin", "teacher"]), editstudent);
router.delete('/delete/:id', auth, authorize(["Admin", "teacher"]), deletestudent);
router.get('/view', auth, authorize(["Admin", "teacher"]), viewallstudent);
router.post('/attendance', auth, authorize(["Admin", "teacher"]), attendence);

module.exports = router;
