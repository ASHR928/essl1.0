const express = require('express');
const Mail = require('../../controllers/MailMailer/MailMailer.controller');
const router = express.Router();

router.post('/sendmail', Mail.SendMail);

module.exports = router;
