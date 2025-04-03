const express = require('express');
const router = express.Router();
const leaverequestcontroller = require("../Leave-request/leave-request.controller")


router.post('/',leaverequestcontroller.submitLeaveRequest)
router.put('/:id',leaverequestcontroller.approveLeaveRequest)
router.get('/allrequests', leaverequestcontroller.getAllLeaveRequests);
router.get('/emprequest/:employeeId', leaverequestcontroller.getLeaveRequestsByEmployeeId);


module.exports = router