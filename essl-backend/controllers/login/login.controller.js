const mssql = require("mssql");
const encrypt = require("../../EncryptDecryptPwd/encrypt");

exports.Login = async (req, res) => {
  try {
    data = req.body;
    await encrypt.encrypt(data.pwd).then((response) => {
      const query = `SELECT Password FROM USER_MASTER WHERE Email='${data.email}' and Role_ID=${data.Role}`;

      mssql.query(query).then((result) => {
        if (result.recordset.length <= 0) {
          res.json({
            sqlMessage: "User name or password is incorrect",
          });
        } else {
          encrypt
            .verify(data.pwd, result.recordset[0].Password)
            .then((verifyPwd) => {
                console.log(verifyPwd);
              if (verifyPwd) {
                const que = `SELECT Emp_ID, Role_ID, Email FROM USER_MASTER WHERE Email='${data.email}' and Password='${result.recordset[0].Password}' and Role_ID=${data.Role}`;

                mssql.query(que).then((result) => {
                  res.send(result.recordset);
                });
              } else {
                res.json({
                  sqlMessage: "User name or password is incorrect",
                });
              }
            });
        }
      });
    });
  } catch (error) {
    res.status(500).json({ sqlMessage: "Internal Server Error " + error });
  }
};

exports.insertUsersDetails = async (req, res) => {
  try {
    const { Emp_ID, Password, Role_ID, Updated_By_UserID } = req.body;

    const newUser = await UserMaster.create({
      Emp_ID,
      Password,
      Role_ID,
      Updated_By_UserID,
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ sqlMessage: "Internal Server Error " + error });
  }
};
