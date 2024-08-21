const express = require('express');
const router = express.Router();
const attendanceLogController = require('../attendance-logs/attendance-logs.controller');

// Define the routes
router.get('/attendanceLogs', attendanceLogController.getAllAttendanceLogs);
router.get('/attendanceLogs/:empId', attendanceLogController.getAttendanceLogByEmployeeCode);
router.post('/attendanceLogs', attendanceLogController.createAttendanceLog);
router.put('/attendanceLogs/:empId', attendanceLogController.updateAttendanceLog);

module.exports = router;
