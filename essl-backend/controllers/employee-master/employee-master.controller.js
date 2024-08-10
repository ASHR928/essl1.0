const EmployeeMaster = require('../employee-master/employee-master');
const XLSX = require('xlsx');


// Get employees by team name
exports.getEmployeesByTeamName = async (req, res) => {
  try {
    const { teamName } = req.params;
    const employees = await EmployeeMaster.findAll({
      where: { Emp_Team_Name: teamName }
    });

    if (employees.length === 0) {
      return res.status(404).json({ error: 'No employees found for this team' });
    }

    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await EmployeeMaster.findAll();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get an employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const { empId } = req.params;
    console.log(empId);
    
    const employee = await EmployeeMaster.findByPk(empId);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new employee
exports.createEmployee = async (req, res) => {
  try {
    const newEmployee = await EmployeeMaster.create(req.body);
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Bulk insert employees from Excel data
exports.bulkInsertEmployees = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Validate and transform data if necessary
    const transformedEmployees = jsonData.map(employee => ({
      Emp_Name: employee.Emp_Name,
      Emp_Alias_Name: employee.Emp_Alias_Name,
      Emp_Company: employee.Emp_Company,
      Emp_Designation: employee.Emp_Designation,
      Emp_Contact_No: employee.Emp_Contact_No,
      Emp_email: employee.Emp_email,
      Emp_Team_Name: employee.Emp_Team_Name,
      Emp_Location: employee.Emp_Location,
      Emp_DOJ: employee.Emp_DOJ ? new Date(employee.Emp_DOJ) : null,
      Emp_Department_Name: employee.Emp_Department_Name,
      PAN_Number: employee.PAN_Number,
      UAN_Number: employee.UAN_Number,
      ESIC_Number: employee.ESIC_Number,
      Is_Active: employee.Is_Active === 'true' || employee.Is_Active === '1',
    }));

    const newEmployees = await EmployeeMaster.bulkCreate(transformedEmployees);
    res.status(201).json(newEmployees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an employee by ID
exports.updateEmployee = async (req, res) => {
  try {
    const { empId } = req.params;
    const [updated] = await EmployeeMaster.update(req.body, {
      where: { Emp_ID: empId }
    });

    if (!updated) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const updatedEmployee = await EmployeeMaster.findByPk(empId);
    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an employee by ID
exports.deleteEmployee = async (req, res) => {
  try {
    const { empId } = req.params;
    const deleted = await EmployeeMaster.destroy({
      where: { Emp_ID: empId }
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(204).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

