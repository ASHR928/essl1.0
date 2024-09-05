const nodemailer = require('nodemailer');

exports.SendMail = async (req, res) => {
    try {
        console.log(req.body);

        const transporter = await nodemailer.createTransport({
            //service: req.body.service,
            host: 'smtppro.zoho.in', // 'smtp.gmail.com', smtp.ethereal.email
            port: '587', //587,
            secure: false,
            auth: {
                user: 'Hrms@prosperitytravels.in', // maryse.dicki@ethereal.email
                pass: 'Hello@124' // BHfcaDKNS5zaKY1YCy
            }
        });
        const mailOptions = {
            from: {
                name: 'Hrms@prosperitytravels.in',
                address: 'Hrms@prosperitytravels.in'
            },
            to: [req.body.to],
            subject: 'Login credentials for HRMS Portal',
            html: `
    <p>Dear ${req.body.name},</p>
    <p>Your login id is <strong>${req.body.user}</strong> and your password is <strong>${req.body.pass}</strong>.</p>
    <br>
    <p>You can access the application using this link:  <a href="http://192.168.2.221:4200">HRMS Portal</a>  </p>
    <p>Regards,</p>
    <p>HR Team</p>
`,
            attachments: [
                {
                    filename: req.filename
                    // path: path.join(__dirname, req.filename)
                }
            ]
            // OR
            //html: req.body.text
        };

        await transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                res.json({ sqlMessage: error });
            } else {
                res.json({ message: info });
            }
        });
    } catch (error) {
        res.status(500).json({ sqlMessage: 'Internal Server Error ' + error });
    }
}
