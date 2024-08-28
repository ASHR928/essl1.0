const mssql = require('mssql');

exports.Login = async (req, res) => {
    try {
        data = req.body;
        const que = `SELECT Emp_ID, Role_ID, Email FROM USER_MASTER WHERE Email='${data.email}' and Password='${data.pwd}' and Role_ID=${data.Role}`;

        await mssql.query(que).then(result => {
            if (result.recordset.length <= 0) {
                res.json({ sqlMessage: 'User name or password is incorrect' });
            } else {
                res.send(result.recordset);
            }
        });
    } catch (error) {
        res.status(500).json({ sqlMessage: 'Internal Server Error ' + error });
    }
}

exports.insertUsersDetails = async (req, res) => {
    try {
        const { Emp_ID, Password, Role_ID, Updated_By_UserID } = req.body;

        const newUser = await UserMaster.create({
            Emp_ID,
            Password,
            Role_ID,
            Updated_By_UserID
        });

        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ sqlMessage: 'Internal Server Error ' + error });
    }
}