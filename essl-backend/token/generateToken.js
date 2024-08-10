const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
    // Create a token with the payload and secret key
    return jwt.sign(payload, 'token', { expiresIn: '1h' });
  };
  
  module.exports = generateToken;