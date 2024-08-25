const express = require('express');
const UsersType = require('../../controllers/user-type/user-type.controller');
const router = express.Router();

router.get('/', UsersType.UserTypeList);

module.exports = router;
