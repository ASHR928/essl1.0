var Sequelize = require("sequelize");
var db = new Sequelize(
    'essl', // Database name
    'test', // Username
    'Anyasoftek@123', // Password
    {
        dialect: "mssql", // Use 'mssql' for SQL Server
        host: '172.105.62.226', // SQL Server host
        dialectOptions: {
            options: {
                encrypt: true, // Enable encryption
                trustServerCertificate: true // Trust the server certificate
            }
        },
        port: 1433, // Default SQL Server port
        logging: false, // Disable logging; set to `console.log` to enable
    }
);

module.exports = db;
