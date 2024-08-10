
const express = require('express');

const upload = require('../upload/upload');


const router = express.Router();
const { getAllRosters, getRosterByEmpId, createRoster, updateRoster, deleteRoster, bulkInsertRoaster, swapRosters } = require('../roaster-master/roaster-master.controller');


// Route to get all roster entries
router.get('/', getAllRosters);

// Route to get a roster entry by Emp_ID
router.get('/:empId', getRosterByEmpId);

// Route to create a new roster entry
router.post('/', createRoster);

// Route to update a roster entry by Emp_ID
router.put('/:empId', updateRoster);

// Route to delete a roster entry by Emp_ID
router.delete('/:empId', deleteRoster);

router.post('/bulk-insert', upload.single('file'), bulkInsertRoaster);

// Route to swap rosters between two employees by their Emp_IDs
router.put('/swap/:empId1/:empId2', swapRosters);


module.exports = router