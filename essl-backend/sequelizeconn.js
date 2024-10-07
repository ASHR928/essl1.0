var Sequelize = require("sequelize");

var db = new Sequelize(
    'etimetracklite1', // Database name
    'test2', // Username
    'test', // Password
    {
        dialect: "mssql", // Use 'mssql' for SQL Server
        host: 'localhost\\SQLEXPRESS', // SQL Server host
        dialectOptions: {
            options: {
                encrypt: false, // Enable encryption
                trustServerCertificate: false // Trust the server certificate
            }
        },
        port: 1433, // Default SQL Server port
        logging: console.log, // Disable logging; set to `console.log` to enable
    }
);

module.exports = db;
