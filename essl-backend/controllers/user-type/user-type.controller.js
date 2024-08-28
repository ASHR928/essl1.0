const mssql = require('mssql');

exports.UserTypeList = async (req, res) => {
    try {
        await mssql.query('SELECT user_id, user_type from USER_TYPE_MASTER', (err, result, fields) => {
            if (err) {
                console.error('Error fetching user details:', err);
                res.status(500).json({ sqlMessage: err });
            } else {
                res.send(result.recordsets[0]);
            }
        });
    } catch (error) {
        res.status(500).json({ sqlMessage: 'Internal Server Error ' + error });
    }
}
