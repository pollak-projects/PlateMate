require('dotenv').config(); 
var mysql = require('mysql');

var connect = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_POST || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.NODE_ENV === 'test' ? process.env.TEST_DB_NAME : process.env.DB_NAME || "vizsgaremek",
});

module.exports = connect;