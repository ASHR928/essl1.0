const express = require('express');
const router = express.Router();
const disputerequestcontroller = require("../dispute-request/dispute-request.controller")


router.post("/",disputerequestcontroller.createDisputeRequest)
router.put("/:id",disputerequestcontroller.updateDisputeStatus)
router.get("/pendingrequests",disputerequestcontroller.getPendingRequests)
router.get("/pendingrequestsId/:employeeId",disputerequestcontroller.getDisputesByEmployeeId)


module.exports = router