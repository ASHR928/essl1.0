const jwt = require("jsonwebtoken");

const verifyToken = (data, res) => {
    jwt.verify(data, 'token', (err, user) => {
        if (err) return res.json({ errorCode: 401, error: err }); // Forbidden
    });
}

module.exports = verifyToken;