const express = require('express');
const Users = require('../../controllers/login/login.controller');
const router = express.Router();

router.get('/', Users.Login);
router.post('/', Users.insertUsersDetails)
// app.get('/client/:_id', client.GetClientListById);

module.exports = router;
