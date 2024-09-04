const mssql = require('mssql');
const encrypt = require('../../EncryptDecryptPwd/encrypt')
const UsersList = require('../login/login')

exports.Login = async (req, res) => {
    try {
        data = req.body;
        const que = `SELECT Emp_ID, Role_ID, Email FROM USER_MASTER WHERE Email='${data.email}' and Password='${data.pwd}' and Role_ID=${data.Role}`;
        console.log(que);
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
        const Emp_ID = req.body.Emp_ID
        const pwd = generatePassword()
        const Password = await encrypt.encrypt(pwd);
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
