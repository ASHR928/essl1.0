const jwt = require("jsonwebtoken");
const verifyToken = require("./verifyToken");

const authenticateToken = (req, res, next, err) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.json({ errorCode: 401, message: err }); // Unauthorized

  verifyToken(token, res, next);

  next();
};

module.exports = authenticateToken;