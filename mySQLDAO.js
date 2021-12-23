var mysql = require('promise-mysql');

mysql.createPool({
    connectionLimit: 3,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'collegedb'
})
    .then((result) => {
        pool = result
    })
    .catch((error) => {
        console.log(error);
    })

var getModules = function () {
    return new Promise((resolve, reject) => {
        pool.query('select * from module')
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

var getModule = function (mid) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'select * from module where mid = ? order by name',
            values: [mid]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            })
    })
}

var changeModule = function (mid, name, credits) {
    return new Promise((resolve, reject) => {
        var newQuery = {
            sql: 'update module set name = "?", credits = "?" where mid = "?"',
            values: [name, credits, mid]
        }
        pool.query(newQuery)
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            })
    })
}
var getStudent = function (mid) {
    return new Promise((resolve, reject) => {
        var Query = {
            sql: 'select s.sid, s.name, s.gpa from student s left join student_module m on s.sid = m.sid where m.mid = ?',
            values: [mid]
        }
        pool.query(Query)
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            })
    })
}

var getListStudents = function () {
    return new Promise((resolve, reject) => {
        pool.query('select * from student')
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

var addStudent = function (sid, name, gpa) {
    return new Promise((resolve, reject) => {
        var newQuery = {
            sql: 'insert into student values(?, ?, ?)',
            values: [sid, name, gpa]
        }
        pool.query(newQuery)
        .then((result) => {
            resolve(result);
        })
        .catch((error) => {
            reject(error);
        })
    })
}

var DeleteStudent = function(student_id)
{
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'delete from student where sid = ?',
            values: [student_id]
        }
        pool.query(myQuery)
        .then((result) =>
        {
            resolve(result)
        })
        .catch((error) => {
            reject(error);
        })
    })
}

module.exports = { getModules, getModule, changeModule, getStudent, getListStudents, addStudent, DeleteStudent };