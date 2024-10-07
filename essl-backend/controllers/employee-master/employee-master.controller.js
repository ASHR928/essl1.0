const EmployeeMaster = require('../employee-master/employee-master');
const XLSX = require('xlsx');
const mssql = require('mssql');
const db = require('../../sequelizeconn')
var Sequelize = require("sequelize");



// Get employees by team name
exports.getEmployeesByTeamNameShiftID = async (req, res) => {

  const { teamName, shiftID } = req.params;
  console.log(req.params);
  console.log(teamName);

  try {

    const query = `SELECT a.Emp_Company_ID
      FROM EMPLOYEE_MASTER as a INNER JOIN ROSTER_MASTER as b ON a.Emp_Company_ID = b.Emp_ID
      and a.Emp_Team_Name = :teamName and b.SHIFT_ID= :shiftID
      `

    const emp = await db.query(query, {
      replacements: { teamName, shiftID },
      type: Sequelize.QueryTypes.SELECT,
    });

    if (emp.length >= 1) {
      res.json(emp);
    } else {
      res.status(404).json({ message: 'Emp roster not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    const employee = await EmployeeMaster.findOne({ where: { Emp_Company_ID: empId } });

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
    const {
      Emp_Company_ID,
      Emp_Name,
      Emp_Alias_Name,
      Emp_Designation,
      Emp_Contact_No,
      Emp_email,
      Emp_Location,
      doj,
      dob,
      Emp_Department_Name,
      PAN_Number,
      Aadhar_no,
      Is_Active
    } = req.body;

    const insertSql = `
      INSERT INTO EMPLOYEE_MASTER (
        Emp_Company_ID,
        Emp_Name,
        Emp_Alias_Name,
        Emp_Designation,
        Emp_Contact_No,
        Emp_email,
        Emp_Location,
        Emp_DOJ,
        Emp_DOB,
        Emp_Department_Name,
        PAN_Number,
        Aadhar_no,
        Is_Active,
        Created_At,
        Updated_At
      )
      VALUES (
        @Emp_Company_ID,
        @Emp_Name,
        @Emp_Alias_Name,
        @Emp_Designation,
        @Emp_Contact_No,
        @Emp_email,
        @Emp_Location,
        @Emp_DOJ,
        @Emp_DOB,
        @Emp_Department_Name,
        @PAN_Number,
        @Aadhar_no,
        @Is_Active,
        @Created_At,
        @Updated_At
      )
    `;

    const request = new mssql.Request();
    request.input('Emp_Company_ID', mssql.VarChar, Emp_Company_ID);
    request.input('Emp_Name', mssql.VarChar, Emp_Name);
    request.input('Emp_Alias_Name', mssql.VarChar, Emp_Alias_Name);
    request.input('Emp_Designation', mssql.VarChar, Emp_Designation);
    request.input('Emp_Contact_No', mssql.VarChar, Emp_Contact_No);
    request.input('Emp_email', mssql.VarChar, Emp_email);
    request.input('Emp_Location', mssql.VarChar, Emp_Location);
    request.input('Emp_DOJ', mssql.DateTime, new Date(doj));
    request.input('Emp_DOB', mssql.DateTime, new Date(dob));
    request.input('Emp_Department_Name', mssql.VarChar, Emp_Department_Name);
    request.input('PAN_Number', mssql.VarChar, PAN_Number);
    request.input('Aadhar_no', mssql.VarChar, Aadhar_no);
    request.input('Is_Active', mssql.Bit, Is_Active !== undefined ? Is_Active : true);
    request.input('Created_At', mssql.DateTime, new Date());
    request.input('Updated_At', mssql.DateTime, new Date());

    await request.query(insertSql);

    // Fetch the newly inserted record
    const selectSql = `
      SELECT TOP 1 * FROM EMPLOYEE_MASTER
      WHERE Aadhar_no = @Aadhar_no AND Emp_Name = @Emp_Name
      ORDER BY Created_At DESC
    `;

    const result = await request.query(selectSql);
    res.status(201).json({
      message: 'Employee created successfully',
      employee: result.recordset[0].Emp_Company_ID
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: 'Error creating employee',
      error: error.message
    });
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

// // Update an employee by ID
// exports.updateEmployee = async (req, res) => {
//   try {
//     const { empId } = req.params;
//     console.log(empId);
//     console.log(req.body);


//     const [updated] = await EmployeeMaster.update(req.body, {
//       where: { Emp_Company_ID: empId }
//     });

//     if (!updated) {
//       return res.status(404).json({ error: 'Employee not found' });
//     }

//     const updatedEmployee = await EmployeeMaster.findAll({ where: { Emp_Company_ID: empId } });
//     res.status(200).json(updatedEmployee);
//   } catch (error) {
//     console.log(error);

//     res.status(500).json({ error: error.message });
//   }
// };

// Update an existing employee
exports.updateEmployee = async (req, res) => {
  try {
    const {
      Emp_Company_ID,
      Emp_Name,
      Emp_Alias_Name,
      Emp_Designation,
      Emp_Contact_No,
      Emp_email,
      Emp_Location,
      Emp_Team_Name,
      Emp_DOJ,
      Emp_DOB,
      Emp_Department_Name,
      PAN_Number,
      Aadhar_no,
      Is_Active
    } = req.body;

    const updateSql = `
      UPDATE EMPLOYEE_MASTER
      SET
        Emp_Name = @Emp_Name,
        Emp_Alias_Name = @Emp_Alias_Name,
        Emp_Designation = @Emp_Designation,
        Emp_Contact_No = @Emp_Contact_No,
        Emp_email = @Emp_email,
        Emp_Team_Name = @Emp_Team_Name,
        Emp_Location = @Emp_Location,
        Emp_DOJ = @Emp_DOJ,
        Emp_DOB = @Emp_DOB,
        Emp_Department_Name = @Emp_Department_Name,
        PAN_Number = @PAN_Number,
        Aadhar_no = @Aadhar_no,
        Is_Active = @Is_Active,
        Updated_At = @Updated_At
      WHERE Emp_Company_ID = @Emp_Company_ID
    `;

    const request = new mssql.Request();
    request.input('Emp_Company_ID', mssql.VarChar, Emp_Company_ID);
    request.input('Emp_Name', mssql.VarChar, Emp_Name);
    request.input('Emp_Alias_Name', mssql.VarChar, Emp_Alias_Name);
    request.input('Emp_Designation', mssql.VarChar, Emp_Designation);
    request.input('Emp_Contact_No', mssql.VarChar, Emp_Contact_No);
    request.input('Emp_email', mssql.VarChar, Emp_email);
    request.input('Emp_Team_Name', mssql.VarChar, Emp_Team_Name);
    request.input('Emp_Location', mssql.VarChar, Emp_Location);
    request.input('Emp_DOJ', mssql.DateTime, new Date(Emp_DOJ));
    request.input('Emp_DOB', mssql.DateTime, new Date(Emp_DOB));
    request.input('Emp_Department_Name', mssql.VarChar, Emp_Department_Name);
    request.input('PAN_Number', mssql.VarChar, PAN_Number);
    request.input('Aadhar_no', mssql.VarChar, Aadhar_no);
    request.input('Is_Active', mssql.Bit, Is_Active !== undefined ? Is_Active : true);
    request.input('Updated_At', mssql.DateTime, new Date());

    await request.query(updateSql);

    // Fetch the updated record
    const selectSql = `
      SELECT * FROM EMPLOYEE_MASTER
      WHERE Emp_Company_ID = @Emp_Company_ID
    `;

    const result = await request.query(selectSql);
    res.status(200).json({
      message: 'Employee updated successfully',
      employee: result.recordset[0]
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: 'Error updating employee',
      error: error.message
    });
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

