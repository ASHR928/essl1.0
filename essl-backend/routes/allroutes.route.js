const router = require('../controllers/login/login.routes');
const loginRoutes = require('../controllers/login/login.routes');

router.use('/login', loginRoutes)

const rosterMasterRoutes = require('../controllers/roaster-master/roaster-master.routes');

router.use('/rosters', rosterMasterRoutes);


const employeeMasterRoutes = require('../controllers/employee-master/employee-master.routes');

router.use('/employees', employeeMasterRoutes);

module.exports = router;



