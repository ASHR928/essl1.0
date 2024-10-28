const mssql = require('mssql');
const encrypt = require('../../EncryptDecryptPwd/encrypt')
const UsersList = require('../login/login')

exports.Login = async (req, res) => {
    try {
        data = req.body;
        const que = `SELECT a.Emp_ID, a.Role_ID, b.Emp_Name FROM USER_MASTER as a inner join EMPLOYEE_MASTER as b 
        on a.Emp_ID=b.Emp_Company_ID where  a.Emp_ID='${data.Emp_ID}' and status='Y' and Password='${data.pwd}' and Role_ID=${data.Role}`;

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

exports.DeleteUser = async (req, res) => {
    try {
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json({ msg: 'Missing userId in query parameters' });
        }

        const query = `UPDATE USER_MASTER SET status = 'N' WHERE Emp_ID = '${userId}'`;
        console.log(query);

        await mssql.query(query).then(result => {
            res.json({ msg: 'User successfully deleted...' });
        });
    } catch (error) {
        res.status(500).json({ sqlMessage: 'Internal Server Error: ' + error.message });
    }
};


exports.insertUsersDetails = async (req, res) => {
    try {
        const Emp_ID = req.body.Emp_ID
        const pwd = generatePassword()
        const Password = pwd; //await encrypt.encrypt(pwd);
        const Role_ID = 3
        const usersDetails = await UsersList.create(
            {
                Emp_ID, Password, Role_ID
            });
        res.status(201).json(usersDetails);
    } catch (error) {
        console.log(error);
        res.status(500).json({ sqlMessage: 'Internal Server Error ' + error });
    }
}

function generatePassword() {
    const alphanumericChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const specialChars = '!@#$%^&*()_+{}[]|:;<>?,./';

    let password = '';

    // Add 7 random alphanumeric characters
    for (let i = 0; i < 7; i++) {
        const randomIndex = Math.floor(Math.random() * alphanumericChars.length);
        password += alphanumericChars[randomIndex];
    }

    // Add 1 random special character
    const randomSpecialChar = specialChars[Math.floor(Math.random() * specialChars.length)];
    password += randomSpecialChar;

    // Shuffle the password to ensure the special character is not always at the end
    password = password.split('').sort(() => Math.random() - 0.5).join('');

    return password;
}
