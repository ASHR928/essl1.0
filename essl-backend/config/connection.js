const mysql = require("mysql");

exports.con = mysql.createConnection({
    host: '172.105.62.226',        
    user: 'test',        
    password: 'Anyasoftek@123', 
    database: 'essl', 
    port: 3306,
    options: {
        encrypt: true, 
        trustServerCertificate: true 
    },     
          
});

// connection.connect((err) => {
//     if (err) {
//         console.error('Error connecting to the database:', err.stack);
//         return;
//     }
//     console.log('Connected to the local database as ID ' + connection.threadId);
// });

// module.exports = connection;
