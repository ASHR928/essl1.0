const authenticateToken = require('../../token/auth');
const Mail = require('../../controllers/MailMailer/MailMailer.controller');

exports.findAll = (app) => {
    app.post('/sendmail', authenticateToken, Mail.SendMail);
}