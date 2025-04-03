const AttendanceLog = require("../attendance-logs/attendance-logs")
const DisputeRequest = require("./dispute-request")
const EmployeeMaster = require("../employee-master/employee-master")
const db = require('../../sequelizeconn')
var Sequelize = require("sequelize");
const moment = require("moment");

exports.createDisputeRequest = async (req, res) => {
    try {
      
      const { EmployeeId, AttendanceDate, Current_status, Requested_status, Reason } = req.body;
      console.log("Request body:", req.body);

      if (!EmployeeId || !AttendanceDate || !Current_status || !Requested_status || !Reason) {
        return res.status(400).json({ message: "All fields are required" });
      }
      // Format the AttendanceDate to include the timezone offset (DATETIMEOFFSET)
    const formattedAttendanceDate = moment(AttendanceDate).toISOString();  // This will give format 'YYYY-MM-DDTHH:mm:ss.sss+00:00'
    
    // Check if the formatted date is valid and ensure correct format for DATETIMEOFFSET
    if (!moment(formattedAttendanceDate).isValid()) {
      return res.status(400).json({ message: "Invalid date format for AttendanceDate" });
    }

  
      const newDispute = await DisputeRequest.create({
        EmployeeId,
        AttendanceDate:formattedAttendanceDate,
        Current_status,
        Requested_status,
        Reason,
       
      });
  
      res.status(201).json(newDispute);
    } catch (error) {
        console.error("Error creating dispute:", error);
      res.status(400).send({ error: "Failed to raise Dispute" });
    }
  };

  exports.updateDisputeStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { Status, Manager_id } = req.body;
  
      const dispute = await DisputeRequest.findByPk(id);
      if (!dispute) {
        return res.status(404).json({ message: "Dispute not found" });
      }

  
      // If the dispute is approved, update attendance logs
      if (Status === "Approved") {
        await db.query(
          `UPDATE AttendanceLogs 
           SET Status = :Requested_status
           WHERE EmployeeId = :EmployeeId AND AttendanceDate = :AttendanceDate`,
          {
            replacements: {
              Requested_status: dispute.Requested_status,
              EmployeeId: dispute.EmployeeId,
              AttendanceDate: dispute.AttendanceDate,
            },
            type: Sequelize.QueryTypes.UPDATE,
          }
        );
      }
  
      // Update the dispute details
      dispute.Status = Status;
      dispute.Manager_id = Manager_id;
      dispute.ResolutionDate = new Date();
      await dispute.save();
  
      res.json({ message: `Dispute ${Status.toLowerCase()} successfully` });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  
exports.getPendingRequests = async (req, res) => {
    try {
      const managerId = req.body; // for now 
  
      const pendingRequests = await DisputeRequest.findAll({
        where: {
          Manager_id: managerId, 
          Status: "Pending",   
        },
        include: [
          {
            model: AttendanceLog, 
            attributes: ["EmployeeId",], 
          },
        ],
      });
  
      res.status(200).json(pendingRequests);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
      res.status(500).json({ error: "Failed to fetch pending requests" });
    }
  };
  exports.getDisputesByEmployeeId = async (req, res) => {
    try {
        const { employeeId } = req.params;

        // Validate employeeId
        if (!employeeId || isNaN(employeeId)) {
            return res.status(400).json({ error: 'Invalid employee ID' });
        }

        // Define the SQL query to fetch disputes for the employee
        const query = `
            SELECT 
                DisputeId,
                AttendanceDate,
                EmployeeId,
                Current_status,
                Requested_status,
                Reason,
                Status,
                Manager_id,
                ResolutionDate
            FROM 
                DisputeRequests
            WHERE 
                EmployeeId = :employeeId
            ORDER BY 
                AttendanceDate DESC;  // Sort by most recent disputes first
        `;

        // Execute the query
        const results = await db.query(query, {
            replacements: { employeeId: parseInt(employeeId) }, // Ensure numeric ID
            type: db.Sequelize.QueryTypes.SELECT,
        });

        // Check if any disputes were found
        if (results.length === 0) {
            return res.status(404).json({ 
                message: 'No disputes found for this employee' 
            });
        }

        // Send the response
        res.status(200).json({
            employeeId: parseInt(employeeId),
            totalDisputes: results.length,
            disputes: results
        });

    } catch (error) {
        console.error('Error fetching disputes by employee ID:', error);
        res.status(500).json({ 
            error: 'Failed to fetch disputes',
            details: error.message 
        });
    }
};