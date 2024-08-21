const sql = require("mssql");

const config = {
    user: 'test', 
    password: 'Anyasoftek@123', 
    server: '172.105.62.226', 
    database: 'essl', 
    options: {
        encrypt: true, // Use encryption
        trustServerCertificate: true, // Trust the server certificate
        enableArithAbort: true // Optional, depending on your SQL Server version
    },
    port: 1433 // Default port for SQL Server
};

exports.con = sql.connect(config)
    .then(pool => {
        console.log("Connected to SQL Server");
        return pool;
    })
    .catch(err => {
        console.error("Database connection failed:", err);
    });
