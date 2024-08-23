const AttendanceLog = require("../attendance-logs/attendance-logs");
const db = require("../../sequelizeconn");
var Sequelize = require("sequelize");

exports.getAttendancePunchLog = async (req, res) => {
  try {
    const { empId } = req.params;

    const query = `select emp.Emp_ID, emp.Emp_Name, emp.Emp_Alias_Name, emp.Emp_Designation, emp.Emp_Team_Name, emp.Emp_Department_Name, ptd.date, ptd.hh_mm
from EMPLOYEE_MASTER as emp inner join PunchTimeDetails as ptd on ptd.tktno = emp.Emp_ID;`;

    const attendanceLog = await db.query(query, {
      type: Sequelize.QueryTypes.SELECT,
    });

    if (attendanceLog.length >= 1) {
      res.json(attendanceLog);
    } else {
      res.status(404).json({ message: "Attendance Punch Log not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

