
var sequelize = require("sequelize");
var db = new sequelize(
    'essl',
    'test',
    'Anyasoftek@123',
    {
        dialect: "mysql",
        host: '172.105.62.226',
        charset: 'utf8mb4', // Use utf8mb4 for full Unicode support
        collate: 'utf8mb4_unicode_ci',
    }
);

module.exports = db;