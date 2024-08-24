const AttendanceLog = require('../attendance-logs/attendance-logs');
const db = require('../../sequelizeconn')
var Sequelize = require("sequelize");

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

// Get a specific attendance log joining two tables
exports.getAttendanceLogByEmployeeCode = async (req, res) => {
  try {

    console.log(req.params);
    const { empId } = req.params;
    console.log(empId);

    const query = `SELECT a.Status, a.AttendanceDate, emp.EmployeeCode
            FROM AttendanceLogs as a
            INNER JOIN employees as emp
          ON a.EmployeeId = emp.EmployeeId where emp.EmployeeCode = :empId;`

    console.log(query);

    const attendanceLog = await db.query(query, {
      replacements: { empId },
      type: Sequelize.QueryTypes.SELECT,
    });


    console.log(attendanceLog);
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
    //const attendanceDate = new Date(req.body.AttendanceDatenceDateString);

    //console.log(attendanceDate.toISOString().replace('T', ' ').split('.')[0] + '.000');

    const { empId } = req.params;

    console.log(req.body);


    const query = `SELECT EmployeeId
          from Employees where EmployeeCode = :empId;`


    // const date = new Date(req.body.AttendanceDate);
    // console.log(date);


    const EmpID = await db.query(query, {
      replacements: { empId },
      type: Sequelize.QueryTypes.SELECT,
    });

    console.log(EmpID[0].EmployeeId
    );
    const employeeId = EmpID[0].EmployeeId;

    const update_query = `update AttendanceLogs set Status = '${req.body.Status}' where EmployeeId = '${employeeId}' and 
          [AttendanceDate] =  '${req.body.AttendanceDate}';`
    const result = await db.query(update_query);

    console.log(result[1]);
    

    if (result[1] == 0) {
      const insert_query = `insert into AttendanceLogs(Status,EmployeeId,AttendanceDate) values
            ('${req.body.Status}','${employeeId}','${req.body.AttendanceDate}')
      `

    }

    const val = res.json(result);
    return val;

    // const [updated] = await AttendanceLog.update(req.body, {
    //   where: {
    //     EmployeeId: EmpID[0].EmployeeId,
    //     AttendanceDate: req.body.AttendanceDate
    //   }
    // });
    // console.log('date fomrmat ', formattedDate);
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

    //console.log(attendanceDate.toISOString().replace('T', ' ').split('.')[0] + '.000');

    const { empId } = req.params;

    console.log(req.body);


    const query = `SELECT EmployeeId
          from Employees where EmployeeCode = :empId;`


    // const date = new Date(req.body.AttendanceDate);
    // console.log(date);


    const EmpID = await db.query(query, {
      replacements: { empId },
      type: Sequelize.QueryTypes.SELECT,
    });

    console.log(EmpID[0].EmployeeId
    );

    const [updated] = await AttendanceLog.update(req.body, {
      where: {
        EmployeeId: EmpID[0].EmployeeId,
        AttendanceDate: req.body.AttendanceDate
      }
    });
    // console.log('date fomrmat ', formattedDate);
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
