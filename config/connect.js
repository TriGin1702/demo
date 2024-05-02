const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  // host: "db",
  port: "3307", // Thay đổi cổng kết nối MySQL
  user: "root",
  password: "my-secret-pw",
  database: "my_database",
});
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to database");
});

module.exports = connection;
