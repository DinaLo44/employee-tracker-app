const mysql = require("mysql2");

const dbConnection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
);

dbConnection.connect(function (error) {
    if (error) {
        throw error;
    }
});

module.exports = dbConnection;