require('dotenv').config()
const mysql = require('mysql');
const util = require("util")

const db = mysql.createPool({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_BASE,
    multipleStatements : true
 })

//connect
db.getConnection((err, connection) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Connected to Database");
    }
    if (connection) connection.release();
    return
  })
  
db.query = util.promisify(db.query);
module.exports = db
