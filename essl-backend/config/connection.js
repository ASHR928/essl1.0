const sql = require("mssql");

const config = {
    user: 'test', 
    password: 'test', 
    server: 'localhost\\SQLEXPRESS', 
    database: 'etimetracklite1', 
    options: {
        encrypt: false, // Use encryption
        trustServerCertificate: false, // Trust the server certificate
        //enableArithAbort: true // Optional, depending on your SQL Server version
    },
  //  port: 1433 // Default port for SQL Server
};

exports.con = sql.connect(config)
    .then(pool => {
        console.log("Connected to SQL Server");
        return pool;
    })
    .catch(err => {
        console.error("Database connection failed:", err);
    });
