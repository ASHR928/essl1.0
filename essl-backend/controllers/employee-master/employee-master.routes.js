
const express = require('express');

const upload = require('../upload/upload');


const router = express.Router();
const Employees = require('../../controllers/employee-master/employee-master.controller');


// Route to get employees by team name
router.get('/team/:teamName', Employees.getEmployeesByTeamName);

// Route to get all roster entries
router.get('/', Employees.getAllEmployees);

// Route to get a roster entry by Emp_ID
router.get('/:empId', Employees.getEmployeeById);

// Route to create a new roster entry
router.post('/', Employees.createEmployee);

// Route to update a roster entry by Emp_ID
router.put('/:empId', Employees.updateEmployee);

// Route to delete a roster entry by Emp_ID
router.delete('/:empId', Employees.deleteEmployee);

router.post('/bulk-insert', upload.single('file'), Employees.bulkInsertEmployees);


module.exports = router