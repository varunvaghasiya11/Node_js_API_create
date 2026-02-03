const express = require("express");
const router = express.Router();
const {AdminDashboard,createstandard,createSubject } = require("../controllers/controller");
const { auth, authorize } = require("../middleware/dashboard");

router.get('/dashboard',auth,authorize(["Admin"]),AdminDashboard);
router.use('/standard',auth,authorize(["Admin"]),createstandard);
router.use('/subject',auth,authorize(["Admin"]),createSubject);

module.exports = router;
