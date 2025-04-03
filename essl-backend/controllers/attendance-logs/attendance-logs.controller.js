const AttendanceLog = require('../attendance-logs/attendance-logs');
const db = require('../../sequelizeconn')
var Sequelize = require("sequelize");

 // Ensure this points to your database connection

exports.getAllAttendanceLogs = async (req, res) => {
  try {
    console.log("API Hit: /api/attendance-logs");
    
    const query = `
      SELECT 
      
        a.AttendanceDate, 
        a.EmployeeId, 
        a.InTime, 
        a.OutTime, 
        a.Duration, 
        a.PunchRecords,
        a.LateBy, 
        a.EarlyBy, 
        a.ShiftId,
        a.Status, 
        e.EmployeeCode, 
        e.EmployeeName
      FROM AttendanceLogs AS a
      INNER JOIN employees AS e ON a.EmployeeId = e.EmployeeId
    `;

    const attendanceLogs = await db.query(query, {
      type: Sequelize.QueryTypes.SELECT,
    });

    if (!attendanceLogs || attendanceLogs.length === 0) {
      console.log("No Attendance Logs Found");
      return res.status(404).json({ message: "No attendance logs found" });
    }

    console.log("Fetched Attendance Logs:", attendanceLogs.length);
    res.json(attendanceLogs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ message: error.message });
  }
};



// Get a specific attendance log by ID
exports.getAttendanceLogById = async (req, res) => {
  try {
    const { empId } = req.params;
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

// Get a specific attendance log joining two tables
exports.getAttendanceLogByEmployeeCode = async (req, res) => {
  console.log(req.params,"chekcsjndbfudf")
  try {
    const { empId } = req.params;

    const query = `SELECT a.Status, a.AttendanceDate, emp.EmployeeCode
            FROM AttendanceLogs as a
            INNER JOIN employees as emp
          ON a.EmployeeId = emp.EmployeeId where emp.EmployeeCode = :empId;`

    const attendanceLog = await db.query(query, {
      replacements: { empId },
      type: Sequelize.QueryTypes.SELECT,
    });

    if (attendanceLog.length >= 1) {
      res.json(attendanceLog);
    } else {
      res.status(404).json({ message: 'AttendanceLog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createAttendanceLog = async (req, res) => {
  try {
    const newAttendanceLog = await AttendanceLog.create(req.body);
    res.status(201).json(newAttendanceLog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateAttendanceLog = async (req, res) => {
  try {
    const { empId } = req.params;

    const query = `SELECT EmployeeId
          from Employees where EmployeeCode = :empId;`

    const EmpID = await db.query(query, {
      replacements: { empId },
      type: Sequelize.QueryTypes.SELECT,
    });

    const employeeId = EmpID[0].EmployeeId;

    let result = null

    const update_query = `update AttendanceLogs set Status = '${req.body.Status}' where EmployeeId = '${employeeId}' and 
          [AttendanceDate] =  '${req.body.AttendanceDate}';`
    result = await db.query(update_query);

    if (result[1] == 0) {
      const insert_query = `insert into AttendanceLogs(Status,EmployeeId,AttendanceDate,Duration,LateBy,EarlyBy,IsOnLeave,WeeklyOff,Holiday,PunchRecords,ShiftId,Present,Absent,StatusCode,IsonSpecialOff,OverTime,OverTimeE,MissedOutPunch) values
            ('${req.body.Status}','${employeeId}','${req.body.AttendanceDate}',540,0,0,0,0,0,'InOut',1,1,0,'P',0,0,0,0)`


      result = await db.query(insert_query);

    }

    const val = res.json(result);
    return val;

    // const [updated] = await AttendanceLog.update(req.body, {
    //   where: {
    //     EmployeeId: EmpID[0].EmployeeId,
    //     AttendanceDate: req.body.AttendanceDate
    //   }
    // });
    // if (updated) {
    //   const updatedAttendanceLog = await AttendanceLog.findOne({ where: { EmployeeId: EmpID[0].EmployeeId } });
    //   res.json(updatedAttendanceLog);
    // } else {
    //   res.status(404).json({ message: 'AttendanceLog not found' });
    // }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an attendance log
exports.updateAttendanceLog_test = async (req, res) => {
  try {
    //const attendanceDate = new Date(req.body.AttendanceDatenceDateString);

    const { empId } = req.params;
    const query = `SELECT EmployeeId
          from Employees where EmployeeCode = :empId;`
    // const date = new Date(req.body.AttendanceDate);
    const EmpID = await db.query(query, {
      replacements: { empId },
      type: Sequelize.QueryTypes.SELECT,
    });

    const [updated] = await AttendanceLog.update(req.body, {
      where: {
        EmployeeId: EmpID[0].EmployeeId,
        AttendanceDate: req.body.AttendanceDate
      }
    });
    
    if (updated) {
      const updatedAttendanceLog = await AttendanceLog.findOne({ where: { EmployeeId: EmpID[0].EmployeeId } });
      res.json(updatedAttendanceLog);
    } else {
      res.status(404).json({ message: 'AttendanceLog not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
