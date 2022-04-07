const mysql = require('mysql');
const dbConfig = require('../config/dbConfig.js')
// 创建与数据库的链接
let con = mysql.createConnection(dbConfig);
// 建立链接
con.connect((err) => {
  if (err) throw err;
  console.log('链接成功');
});

function query(sql) {
  return new Promise((resolve, reject) => {
    con.query(sql, (err, results, fields) => {
      if (err) reject(err);
      resolve(results);
    })
  })
}

module.exports = query;