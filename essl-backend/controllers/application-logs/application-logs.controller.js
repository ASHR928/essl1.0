const ApplicationLog = require('../application-logs/application-logs');
const db = require('../../sequelizeconn')


// Create a new log entry
exports.createLog = async (req, res) => {
  try {
    const log = await ApplicationLog.create(req.body);
    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



// Get all logs
exports.getAllLogs = async (req, res) => {
  try {

    const query = `SELECT   a.action_screen, a.description, a.created_at, emp.EmployeeCode, emp.EmployeeName 
    FROM ApplicationLogs as a INNER JOIN employees as emp ON a.employee_id = emp.EmployeeCode`

    const applicationLog = await db.query(query);

    if (applicationLog.length >= 1) {
      res.json(applicationLog);
    } else {
      res.status(404).json({ message: 'applicationLog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get logs by employee_id
exports.getLogsByEmployeeId = async (req, res) => {
  try {
    const { employee_id } = req.params;
    const logs = await ApplicationLog.findAll({ where: { employee_id } });
    if (logs.length > 0) {
      res.status(200).json(logs);
    } else {
      res.status(404).json({ message: 'No logs found for this employee' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
