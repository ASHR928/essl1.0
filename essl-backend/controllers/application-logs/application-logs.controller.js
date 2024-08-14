const ApplicationLog = require('../application-logs/application-logs');

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
    const logs = await ApplicationLog.findAll();
    res.status(200).json(logs);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
