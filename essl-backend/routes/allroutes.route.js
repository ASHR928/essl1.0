const router = require('../controllers/login/login.routes');
const loginRoutes = require('../controllers/login/login.routes');

router.use('/login', loginRoutes)

const rosterMasterRoutes = require('../controllers/roaster-master/roaster-master.routes');

router.use('/rosters', rosterMasterRoutes);

const shiftMasterRoutes=require('../controllers/shift-master/shift-master.routes');

router.use('/shifts',shiftMasterRoutes);


const employeeMasterRoutes = require('../controllers/employee-master/employee-master.routes');

router.use('/employees', employeeMasterRoutes);

const attendancePunchLogRoutes = require('../controllers/attendance-punch-logs/attendance-punch-logs.routes')
router.use('/punchrecords', attendancePunchLogRoutes);

const attendanceLogRoutes = require('../controllers/attendance-logs/attendance-logs.routes')
router.use('/attendance', attendanceLogRoutes);


const applicationLogRoutes = require('../controllers/application-logs/application-logs.routes')
router.use('/applicationlogs', applicationLogRoutes);

const userTypesRoutes = require('../controllers/user-type/user-type.routes')
router.use('/usertypes', userTypesRoutes);

const mailer = require('../controllers/MailMailer/MailMailer.routes')
router.use('/mailer', mailer);

const disputeRequestRoutes = require("../controllers/dispute-request/dispute-request.routes")
router.use("/disputes",disputeRequestRoutes)
const leaveRequestRoutes = require("../controllers/Leave-request/leave-request.routes")
router.use("/leaverequest",leaveRequestRoutes)
const rosterRequestRoutes = require("../controllers/roster-request/roster-request.routes")
router.use("/rosterrequest",rosterRequestRoutes)
module.exports = router;



