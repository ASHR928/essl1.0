const nodemailer = require('nodemailer');

exports.SendMail = async (req, res) => {
    try {
        const transporter = await nodemailer.createTransport({
            service: req.body.service,
            host: req.body.host, // 'smtp.gmail.com', smtp.ethereal.email
            port: req.body.port, //587,
            secure: false,
            auth: {
                user: req.body.user, // maryse.dicki@ethereal.email
                pass: req.body.pass // BHfcaDKNS5zaKY1YCy
            }
        });
        const mailOptions = {
            from: {
                name: req.body.name,
                address: req.body.address
            },
            to: [req.body.to],
            subject: req.body.subject,
            html: req.body.html,
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
                res.json({message: info });
            }
        });
    } catch (error) {
        res.status(500).json({ sqlMessage: 'Internal Server Error ' + error });
    }
}
