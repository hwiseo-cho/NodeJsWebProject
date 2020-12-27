var mysql = require('mysql');

var con = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'121212',
    database:'TEST'
});


module.exports = con;