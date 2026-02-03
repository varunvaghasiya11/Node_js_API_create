const express = require("express");
const router = express.Router();
const { TeacherDashboard, createteacher, viewteacher, deleteteacher ,editteacher} = require("../controllers/controller");
const { auth, authorize } = require("../middleware/dashboard");


router.get('/dashboard', auth, authorize(["Admin", "teacher"]), TeacherDashboard);
router.post('/create', auth, authorize(["Admin"]), createteacher);
router.put('/edit/:id', auth, authorize(["Admin"]), editteacher);
router.get('/allteacher', auth, authorize(["Admin"]), viewteacher);
router.delete('/delete/:id', auth, authorize(["Admin"]), deleteteacher);

module.exports = router;
