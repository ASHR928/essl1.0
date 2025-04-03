const db = require('../../sequelizeconn')
var Sequelize = require("sequelize");
const RosterRequest = require('./roster-request');
const XLSX = require("xlsx");
const RosterMaster = require("../roaster-master/roaster-master")
const moment = require("moment");
const fs = require('fs');



exports.createRosterRequest = async(req,res) =>{
    try {
        const {tlId} = req.params
        const { file } = req.body; 
        
        
        if(!file){
            return res.status(400).json({erro: "No file Uploaded"})
        }
        const fileBuffer = Buffer.from(file, 'base64');

        if (!/^[A-Za-z0-9+/=]+$/.test(file)) {
            return res.status(400).json({ error: 'Invalid Base64 string' });
          }

          console.log(fileBuffer)
          console.log('File buffer type:', typeof fileBuffer); 
          const lastRecord = await RosterRequest.findOne({
            order: [['RM_ID', 'DESC']] // Get the highest RM_ID
        });

        const newRM_ID = lastRecord ? lastRecord.RM_ID + 1 : 1; 
      
        const newRoster = await RosterRequest.create({
            RM_ID:newRM_ID,
            TL_ID: tlId,
            Roster_File_Path: fileBuffer, // Store the file as binary data
            Status: 'Pending',
            // Current date/time
        })
        res.status(200).json({message:"Roster createed sucessfully", request:newRoster})
        
    } catch (error) {
        console.error('Error creating roster request:', error);
        res.status(500).json({ error: 'Failed to create roster request' });
    }
}

exports.approveRosterRequest = async (req, res) => {
    try {
      const { requestId } = req.params;
      const { managerId,status,comment } = req.body;
  
      const rosterRequest = await RosterRequest.findOne({ where: { Request_ID: requestId } });
      if (!rosterRequest) {
        return res.status(404).json({ error: 'Roster request not found' });
      }
  
      if (rosterRequest.Status === 'Approved') {
        return res.status(400).json({ error: 'Roster request is already approved' });
      }
      console.log('Updated_At:', rosterRequest.Updated_At);
      const formattedUpdatedAt = moment(rosterRequest.Updated_At).toISOString();
      rosterRequest.Status = status;
      rosterRequest.Manager_ID = managerId;
      rosterRequest.Comments = comment;
      rosterRequest.Updated_At = formattedUpdatedAt;
      console.log('Updated_At:', rosterRequest.Updated_At);
      await rosterRequest.save();

     
      res.status(200).json({ message: 'Roster request approved successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };




  exports.bulkInsertRosterMaster = async (req, res) => {
    try {
      const { requestId } = req.params;
  
      const rosterRequest = await RosterRequest.findOne({ where: { Request_ID: requestId } });
      if (!rosterRequest) {
        return res.status(404).json({ error: 'Roster request not found' });
      }
  
      if (rosterRequest.Status !== 'Approved') {
        return res.status(400).json({ error: 'Roster request is not approved' });
      }
  
      const fileBuffer = rosterRequest.Roster_File_Path;
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
      const transformedUsers = jsonData.map(user => ({
        Emp_ID: user.Emp_ID,
        Weekly_Off1: user.Weekly_Off1,
        Weekly_Off2: user.Weekly_Off2,
        Shift_ID: user.Shift_ID,
        Start_Date: user.Start_Date ? excelDateToJSDate(user.Start_Date) : null,
        End_Date: user.End_Date ? excelDateToJSDate(user.End_Date) : null,
        Updated_By_UserID: rosterRequest.Manager_ID,
      }));
  
      const newUsers = await RosterMaster.bulkCreate(transformedUsers);
      res.status(201).json({
        message: 'Data inserted into RosterMaster successfully',
        newUsers,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
function excelDateToJSDate(serial) {
    const excelBaseDate = new Date(Date.UTC(1899, 11, 30)); // Excel base date
    const jsDate = new Date(excelBaseDate.getTime() + serial * 86400000); // Convert serial to date
    
    // Manually adjust the timezone offset if needed (e.g., convert to UTC)
    const offset = jsDate.getTimezoneOffset();
    jsDate.setMinutes(jsDate.getMinutes() - offset);
  
    // Manually format the date to 'YYYY-MM-DDTHH:MM:SS.sss' without timezone offset
    const year = jsDate.getUTCFullYear();
    const month = String(jsDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(jsDate.getUTCDate()).padStart(2, '0');
    const hours = String(jsDate.getUTCHours()).padStart(2, '0');
    const minutes = String(jsDate.getUTCMinutes()).padStart(2, '0');
    const seconds = String(jsDate.getUTCSeconds()).padStart(2, '0');
    const milliseconds = String(jsDate.getUTCMilliseconds()).padStart(3, '0');
  
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`; // Ensure 'Z' for UTC
  }


  exports.getAllRosterRequests = async (req, res) => {
    try {
      const requests = await RosterRequest.findAll();
      res.status(200).json(requests);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Download roster file (stored as binary data)
  exports.downloadRosterFile = async (req, res) => {
    try {
        console.log(req.params)
        const requestId = parseInt(req.params.requestId, 10);
        console.log(requestId)
        

        // Find the roster request
        const rosterRequest = await RosterRequest.findOne({ where: { Request_ID: requestId } });
        console.log(rosterRequest)
        if (!rosterRequest) {
            console.log("No file found for Request_ID:", requestId);
            return res.status(404).json({ error: 'Roster request not found' });
        }

        const fileBuffer = rosterRequest.Roster_File_Path; // Binary data stored in DB

        if (!fileBuffer) {
            console.log("No file stored for this request ID.");
            return res.status(404).json({ error: 'File not found' });
        }

        // Set headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="roster-${requestId}.xlsx"`);
        res.setHeader('Content-Length', fileBuffer.length);

        // Send file buffer
        res.end(fileBuffer); // Use res.end instead of res.send
    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};