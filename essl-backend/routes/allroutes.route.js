const router = require('../controllers/login/login.routes');
const loginRoutes = require('../controllers/login/login.routes');

router.use('/login', loginRoutes)

const rosterMasterRoutes = require('../controllers/roaster-master/roaster-master.routes');

router.use('/rosters', rosterMasterRoutes);


const employeeMasterRoutes = require('../controllers/employee-master/employee-master.routes');

router.use('/employees', employeeMasterRoutes);

const attendancePunchLogRoutes = require('../controllers/attendance-punch-logs/attendance-punch-logs.routes')
router.use('/punchrecords', attendancePunchLogRoutes);

const attendanceLogRoutes = require('../controllers/attendance-logs/attendance-logs.routes')
router.use('/attendance', attendanceLogRoutes);


const applicationLogRoutes = require('../controllers/application-logs/application-logs.routes')
router.use('/applicationlogs', applicationLogRoutes);

module.exports = router;



