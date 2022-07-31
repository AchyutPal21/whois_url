const mysql2 = require("mysql2");

const pool = mysql2.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
});

pool.on("error", (error) => {
  if (error) {
    throw error.message;
  }

  console.log("DB connection successfull!!!");
});

module.exports = pool.promise();
