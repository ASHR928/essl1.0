const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

// Create a connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'SA',
    password: 'sa_password',
    database: 'etimetracklite1',
    port: 3306
});

async function insertAdminUser(loginName, loginPassword, role) {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(loginPassword, saltRounds);

        const query = `INSERT INTO Users 
                        (LoginName, LoginPassword, Role, IsAdmin, AccessI, RecordStatus) 
                        VALUES 
                        (?, ?, ?, ?, ?, ?)`;
        const values = [loginName, hashedPassword, role, 1, -1, 1];
        const [rows] = await pool.execute(query, values);
    } catch (err) {
        console.error('Error creating admin user:', err);
    }
}

insertAdminUser('essl1', 'essl123@', 'Admin');
