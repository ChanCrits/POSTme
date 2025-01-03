const mysql = require('mysql2');

const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'blog',
});

database.connect((error) => {
    if (error) {
        console.error('Database: Not connected!', error);
        return;
    }
    console.log("Database: Connected successfully!");
});

module.exports = database;
