const db = require('../../sequelizeconn')
var Sequelize = require("sequelize");

const LeaveRequest = require('../Leave-request/leave-request');
const UserMaster = require("../login/login")



exports.submitLeaveRequest = async (req, res) => {
    try {
      const { Employee_Id, LeaveTypeId, FromDate, ToDate } = req.body;
  
      const newRequest = await LeaveRequest.create({
        Employee_Id,
        LeaveTypeId,
        FromDate,
        ToDate,
     
      });
  
      res.status(201).json({ message: 'Leave request submitted successfully', data: newRequest });
    } catch (error) {
      console.error('Error submitting leave request:', error);
      res.status(500).json({ error: 'Failed to submit leave request' });
    }
  };


  exports.approveLeaveRequest = async (req, res) => {
    try {
        const { LeaveEntryId,  IsApproved } = req.body;
        const ManagerId = req.params.id
        // Check if the request exists
        const leaveRequest = await LeaveRequest.findOne({ where: { LeaveEntryId } });
        if (!leaveRequest) {
            return res.status(404).json({ error: 'Leave request not found.' });
        }
        // Ensure only managers can approve
        const manager = await UserMaster.findOne({ where: { Emp_ID: ManagerId, Role_ID: 1 } });
        if (!manager) {
            return res.status(403).json({ error: 'Only managers can approve leave requests.' });
        }
        console.log('ManagerId:', ManagerId);
        leaveRequest.IsApproved = IsApproved;
        leaveRequest.LeaveStatus = IsApproved ? 'Approved' : 'Rejected';
        leaveRequest.ApprovedBy_EmpID = ManagerId;
        await leaveRequest.save();
        res.status(200).json({ message: 'Leave request updated successfully.', leaveRequest });
    } catch (error) {
        console.error('Error approving leave request:', error);
        res.status(500).json({ error: 'Failed to update leave request.' });
    }
};


exports.getAllLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.findAll({
      attributes: ['Employee_Id',"LeaveEntryId", 'LeaveTypeId', 'FromDate', 'ToDate', 'IsApproved',"LeaveStatus"] // Specify columns here
    });
    res.status(200).json(leaveRequests);
    console.log(leaveRequests)
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    res.status(500).json({ error: 'Failed to fetch leave requests.' });
  }
};
exports.getLeaveRequestsByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const leaveRequests = await LeaveRequest.findAll({
      attributes: ['Employee_Id',"LeaveEntryId", 'LeaveTypeId', 'FromDate', 'ToDate', "LeaveStatus"],
      where: { Employee_Id: employeeId }
    });
    res.status(200).json(leaveRequests);
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    res.status(500).json({ error: 'Failed to fetch leave requests.' });
  }
};

