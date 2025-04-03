
const RosterMaster = require('../roaster-master/roaster-master');
const XLSX = require('xlsx');

// Bulk insert users from Excel data
exports.bulkInsertRoaster = async (req, res) => {
  try {
    const employeeId = req.body.employee_id;    
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Validate and transform data if necessary
    const transformedUsers = jsonData.map(user => ({
      Emp_ID: user.Emp_ID,
      Weekly_Off1: user.Weekly_Off1,
      Weekly_Off2: user.Weekly_Off2,
      Shift_ID: user.Shift_ID,
      Start_Date: user.Start_Date ? excelDateToJSDate(user.Start_Date) : null,
      End_Date: user.End_Date ? excelDateToJSDate(user.End_Date) : null,
      Updated_By_UserID: employeeId,
    }));

    const newUsers = await RosterMaster.bulkCreate(transformedUsers);
    res.status(201).json(newUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
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



// Get all roster entries
exports.getAllRosters = async (req, res) => {
  try {
    const rosters = await RosterMaster.findAll();
    res.status(200).json(rosters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a roster entry by Emp_ID
exports.getRosterByEmpId = async (req, res) => {
  try {
    console.log(req.params);
    
    const { empId } = req.params;
    const roster = await RosterMaster.findOne({ where: { Emp_ID: empId } });
    if (!roster) {
      return res.status(404).json({ error: 'Roster entry not found' });
    }
    res.status(200).json(roster);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Create a new roster entry
exports.createRoster = async (req, res) => {
  try {
    const newRoster = await RosterMaster.create(req.body);
    res.status(201).json(newRoster);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Update a roster entry by Emp_ID
exports.updateRoster = async (req, res) => {
  try {
    const { empId } = req.params;
    const [updated] = await RosterMaster.update(req.body, {
      where: { Emp_ID: empId }
    });
    if (!updated) {
      return res.status(404).json({ error: 'Roster entry not found' });
    }
    const updatedRoster = await RosterMaster.findOne({ where: { Emp_ID: empId } });
    res.status(200).json(updatedRoster);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a roster entry by Emp_ID
exports.deleteRoster = async (req, res) => {
  try {
    const { empId } = req.params;
    const deleted = await RosterMaster.destroy({
      where: { Emp_ID: empId }
    });
    if (!deleted) {
      return res.status(404).json({ error: 'Roster entry not found' });
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Method to swap rosters between two employees
exports.swapRosters = async (req, res) => {
  try {
    const { empId1, empId2 } = req.params;

    // Find both employees
    const employee1 = await RosterMaster.findOne({ where: { Emp_ID: empId1 } });
    const employee2 = await RosterMaster.findOne({ where: { Emp_ID: empId2 } });

    if (!employee1 || !employee2) {
      return res.status(404).json({ error: 'One or both employees not found' });
    }

    // Swap the Weekly_Off1 and Weekly_Off2 values
    const tempWeeklyOff1 = employee1.Weekly_Off1;
    const tempWeeklyOff2 = employee1.Weekly_Off2;

    employee1.Weekly_Off1 = employee2.Weekly_Off1;
    employee1.Weekly_Off2 = employee2.Weekly_Off2;

    employee2.Weekly_Off1 = tempWeeklyOff1;
    employee2.Weekly_Off2 = tempWeeklyOff2;

    // Save the updated records
    await employee1.save();
    await employee2.save();

    res.status(200).json({ message: 'Rosters swapped successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.requestAddRoster = async (req, res) => {
  try {

    const { Emp_ID, Weekly_Off1, Weekly_Off2, Shift_ID, Start_Date,Role_ID, End_Date } = req.body;

    if (Role_ID !== '3') {
      return res.status(403).json({ error: 'Only Admiin can request to add a roster' });
    }

    const newRoster = await RosterMaster.create({
      Emp_ID,
      Weekly_Off1,
      Weekly_Off2,
      Shift_ID,
      Start_Date,
      End_Date,
      // Requested_By: userId, // TL's ID
      Status: 'Pending', // Default status
    });

    res.status(201).json({
      message: 'Roster request submitted successfully',
      roster: newRoster,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.approveorRejectRoster = async (req,res)=>{
  try {
    const {rosterId} = req.params;
    const {status,Role_ID} = req.body

    if(Role_ID !== 3){
      return res.status(403).json({ error: 'Only Admin can approve or reject roster requests' });
    }
    const roster = await RosterMaster.findOne({ where: { RM_ID: rosterId } });
    if (!roster) {
      return res.status(404).json({ error: 'Roster request not found' });
    }
    if (roster.Status !== 'Pending') {
      console.log('No roster found with RM_ID:', rosterId);
      return res.status(400).json({ error: 'Roster request is already processed' });
    }
    roster.Status = status;
    await roster.save();
    res.status(200).json({
      message: `Roster request created successfully`,
      roster,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}