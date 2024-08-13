const AttendanceLog = require('../attendance-logs/attendance-logs');

// Get all attendance logs
exports.getAllAttendanceLogs = async (req, res) => {
  try {
    const attendanceLogs = await AttendanceLog.findAll();
    res.json(attendanceLogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific attendance log by ID
exports.getAttendanceLogById = async (req, res) => {
  try {

    console.log(req.params);
    
    const { empId } = req.params;
    console.log(empId);

    const attendanceLog = await AttendanceLog.findAll({ where: { EmployeeId: empId } });
    if (attendanceLog) {
      res.json(attendanceLog);
    } else {
      res.status(404).json({ message: 'AttendanceLog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new attendance log
exports.createAttendanceLog = async (req, res) => {
  try {
    const newAttendanceLog = await AttendanceLog.create(req.body);
    res.status(201).json(newAttendanceLog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an attendance log
exports.updateAttendanceLog = async (req, res) => {
  try {
    const { empId } = req.params;
    const [updated] = await AttendanceLog.update(req.body, {
      where: { EmployeeId: empId }
    });
    if (updated) {
      const updatedAttendanceLog = await AttendanceLog.findOne({ where: { EmployeeId: empId } });
      res.json(updatedAttendanceLog);
    } else {
      res.status(404).json({ message: 'AttendanceLog not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
