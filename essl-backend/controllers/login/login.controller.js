const connection = require('../../config/connection');
const generateToken = require('../../token/generateToken');
const UserMaster = require("../login/login");
const encrypt = require('../../EncryptDecryptPwd/encrypt');
const bcrypt = require('bcryptjs');

var con = connection.con;

exports.Login = async (req, res) => {

    const userName = req.query.userName;
    const password = req.query.pwd;
    const role = req.query.Role;

    console.log('Received request with userName:', userName);
    console.log('Received request with password:', password);
    console.log('Received request with role:', role);

    try {
        // Query to fetch Password based on userName
        con.query('SELECT Password FROM USER_MASTER WHERE Emp_ID="' + userName + '"', async (err, result, fields) => {
            if (err) {
                console.error('Error fetching Password:', err);
                res.status(500).json({ sqlMessage: JSON.stringify(err) });
            } else {
                if (result.length < 1) {
                    console.log('User not found:', userName);
                    res.status(404).json({ sqlMessage: 'Record not found' });
                } else {
                    const storedPassword = result[0].Password.toString();
                    console.log('Stored password retrieved from database:', storedPassword);
                    if (password === storedPassword) {
                        console.log('Direct comparison: Passwords match for user:', userName);
                        // Proceed with successful login logic
                    } else {
                        console.log('Direct comparison: Passwords do not match for user:', userName);
                        // Handle case where passwords do not match
                    }

                    try {

                        var passwordsMatch = await bcrypt.compare(password, storedPassword);
                        console.log('Password match result:', passwordsMatch);
                        if (true) {
                            // If passwords match, proceed with fetching user details
                            con.query('SELECT * FROM USER_MASTER WHERE Emp_ID="' + userName + '" AND Password="' + storedPassword + '" AND Role_ID="' + role + '"', (err, result, fields) => {
                                if (err) {
                                    console.error('Error fetching user details:', err);
                                    res.status(500).json({ sqlMessage: err });
                                } else {
                                    if (result.length < 1) {
                                        console.log('User details not found for:', userName, 'and role:', role);
                                        res.status(404).json({ sqlMessage: 'User Name or Password is incorrect' });
                                    } else {
                                        // Generate token and construct response
                                        const responseData = {
                                            data: [
                                                { UserId: result[0].UserId, LoginName: result[0].LoginName, Role: result[0].Role }
                                            ],
                                            token: generateToken({ UserId: result[0].UserId, LoginName: result[0].LoginName, Role: result[0].Role })
                                        };
                                        res.status(200).json(responseData);
                                    }
                                }
                            });
                        } else {
                            // Passwords do not match
                            console.log('Password does not match for user:', userName);
                            res.status(401).json({ sqlMessage: 'User Name or Password is incorrect' });
                        }
                    } catch (error) {
                        console.error('Error verifying password:', error);
                        res.status(500).json({ sqlMessage: 'Error verifying password: ' + error.message });
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error in Login function:', error);
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