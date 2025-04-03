const express = require('express');
const router = express.Router();
const rosterController = require("./roster-request.controller")


router.get('/requests', rosterController.getAllRosterRequests);

// Approve roster request and bulk insert
router.put('/approve/:requestId', rosterController.approveRosterRequest);
router.get('/download/:requestId', rosterController.downloadRosterFile);
router.post('/create/:tlId', rosterController.createRosterRequest);
router.post('/bulkinsert/:requestId', rosterController.bulkInsertRosterMaster);


module.exports = router