const mysql = require('mysql')
const config = require('../config/index')

const pool = mysql.createPool({
    host: config.database.HOST,
    database: config.database.DATABASE,
    user: config.database.USERNAME,
    password: config.database.PASSWORD
})

let query = function (sql, values) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, values, (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                    connection.release()
                })
            }

        })
    })
}

let createTable = function (sql) {
    return query(sql, [])
}

const users = `create table if not exists users(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    PRIMARY KEY ( id )
   );`

createTable(users)

module.exports = {
    query
}