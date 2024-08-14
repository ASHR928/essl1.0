const express = require('express');
const router = express.Router();
const applicationLogsController = require('../application-logs/application-logs.controller');

// Route to create a new log entry
router.post('/', applicationLogsController.createLog);

// Route to get all log entries
router.get('/', applicationLogsController.getAllLogs);

// Route to get log entries by employee_id
router.get('/employee/:employee_id', applicationLogsController.getLogsByEmployeeId);

module.exports = router;
