const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.DATABASE_USER_NAME,
  password: process.env.DATABASE_PASSWORD, // set your MySQL root password
  database: process.env.DATABASE_NAME
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

module.exports = connection;
