let mysql = require('mysql');
let Promise = require('bluebird');
let connection = mysql.createConnection({
    host:'localhost',
    port:3306,
    database:'zf',
    user:'root',
    // password:'123456'
    password:'a1234567'
});
connection.connect();
module.exports = Promise.promisify(connection.query).bind(connection);