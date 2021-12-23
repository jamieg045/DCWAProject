var express = require('express');
const res = require('express/lib/response');
var mySQL = require('./mySQLDAO');
var app = express()
var bodyParser = require('body-parser');
const { body, validationResult, check } = require('express-validator')
var mongoDAO = require('./mongoDAO');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }))

var pool;

// Getting to the home page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/home.html');
})

//Creating the page that lists all the modules and passing in the modules from the showModules.ejs file
app.get('/listmodules', (req, res) => {
    mySQL.getModules()
        .then((result) => {
            console.log(result)
            res.render(__dirname + '/showModules', { modules: result })
        })
        .catch((error) => {
            res.send(error)
        })
})

// Creating an edit page where the user can change the variables of the module
app.get('/edit/:module', (req, res) => {
    mySQL.getModule(req.params.module)
        .then((result) => {
            console.log(result);
            res.render(__dirname + '/edit', { module: result[0] })
        })
        .catch((error) => {
            res.send(error);
        })
    })

    // app.post('/edit/:module', (req, res) => {
    //     mySQL.changeModule(req.params.module)
    //      .then((result) => {
    //         //console.log(result);
    //         res.redirect('/listmodules');
    //      })
    //      .catch((error) => {
    //          res.send(error);
    //          console.log(error);
    //      })
    //})

    //Post method for sending off the data input from the user
    // Was unable to send back the edited data to the table
    app.post('/edit/', (req, res) => {
        mySQL.changeModule(req.body.mid, req.body.name, req.body.credits)
            .then((result) => {
                res.redirect('/listmodules')
            })
            .catch((error) => {
                if(error.message.includes("11000"))
                {
                    res.send("Error: Module with MID "+ req.bpdy.mid+" already exists");
                }
                else{
                    res.send(error.message);
                }
            })
        })

        
    app.get('/students/:student', (req, res) => {
        mySQL.getStudent(req.params.student)
            .then((result) => {
                console.log(result)
                res.render(__dirname + '/showStudent', { students: result })
            })
            .catch((error) => {
                res.send(error)
            })
    })

    app.get('/listStudents', (req, res) => {
        mySQL.getListStudents()
            .then((result) => {
                console.log(result)
                res.render(__dirname + '/listStudent', { lists: result })
            })
            .catch((error) => {
                res.send(error)
            })
    })

    app.get('/delete/:list', (req, res) => {
        mySQL.DeleteStudent(req.params.list)
            .then((result) => {
                res.redirect('/listStudents')
            })
            .catch((error) => {
                res.send("<h1>Error Message</h1> <br></br> <h3> <h3> " + req.params.list + " has associated modules he/she cannot be deleted</h3>");
            })
    })

    app.get('/addStudent', (req, res) => {
        res.render("addStudent");
    })

    app.post('/addStudent', (req, res) => {
        mySQL.addStudent(req.body.sid, req.body.name, req.body.gpa)
            .then((result) => {
                res.redirect('/listStudents')
            })
            .catch((error) => {
                res.send(error)
            })
    })

    app.get('/listlecturers', (req, res) => {
        mongoDAO.getLecturers()
            .then((documents) => {
                console.log(documents);
                res.render(__dirname + '/listlecture', { lecturers: documents })
            })
            .catch((error) => {
                res.send(error);
            })
    })

    app.get('/addLecturer', (req, res) => {
        res.render("addLecturer")
    })

    app.post('/addLecturer',
        // [check('_id'.isLength({min:4}).withMessage("Lecturer ID must be 4 characters"))]
        (req, res) => {
            mongoDAO.addLecturer(req.body._id, req.body.name, req.body.dept)
                .then((result) => {
                    res.redirect('/listlecturers')
                })
                .catch((error) => {
                    if (error.message.includes("11000")) {
                        res.send("_id is already in use")
                    }
                    res.send(error.message)
                })
        })

    app.listen(3000, () => {
        console.log("Listening on port 3000");
    });