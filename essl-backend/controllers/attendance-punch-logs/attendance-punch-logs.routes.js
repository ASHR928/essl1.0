const express = require('express');
const router = express.Router();
const attendancePunchLogController = require('../attendance-punch-logs/attendance-punch-logs.controller');

// Define the routes
router.get('/attendancepunchlogs/:arg/:empID', attendancePunchLogController.getAttendancePunchLog)

module.exports = router;
