
const RosterMaster = require('../roaster-master/roaster-master');
const XLSX = require('xlsx');

// Bulk insert users from Excel data
exports.bulkInsertRoaster = async (req, res) => {
  try {
    const empRoaster = req.body;

    const file = req.file;
    console.log(req.body)

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
      Start_Date: user.Start_Date,
      End_Date: user.End_Date,
      Updated_By_UserID: user.Updated_By_UserID
    }));

    const newUsers = await RosterMaster.bulkCreate(transformedUsers);
    res.status(201).json(newUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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
    console.log('Request Body:', req.body); // Log the request body to verify data

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