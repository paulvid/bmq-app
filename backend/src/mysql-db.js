// var mysql = require('mysql');
// var db = null
// //local mysql db connection
// // var connection = mysql.createConnection({
// //     host     : 'docker.for.mac.localhost',
// //     port     : '3306',  
// //     user     : 'bm_user',
// //     password : 'HWseftw33#',
// //     database : 'beast_mode_db'
// // });

// // connection.connect(function(err) {
// //     if (err) throw err;
// // });

var mysql = require('promise-mysql');
 
var pool = mysql.createPool({
  host: 'docker.for.mac.localhost',
  user: 'root',
  port: '3306',
  password: 'HWseftw33#',
  database: 'beast_mode_db',
  connectionLimit: 10
});
 
function getSqlConnection() {
  return pool.getConnection().disposer(function(connection) {
    pool.releaseConnection(connection);
  });
}
 
module.exports = getSqlConnection;