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

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/home.html');
})

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

app.get('/edit/:module', (req, res) => {
    mySQL.getModule(req.params.module)
        .then((result) => {
            console.log(result);
            res.render(__dirname + '/edit', { module: result[0] })
        })
        .catch((error) => {
            res.send(error);
        })

        app.post('/edit/:module', (req, res) => {
            mySQL.getModule(req.params.module)
             .then((result) => {
                 res.redirect('/listmodules')
             })
             .catch((error) => {
                 console.log(error);
                 if(error.message.includes("11000")) {
                     res.send("_id is already in use")
                 }
                 res.send(error.message)
             })
        })

    // app.post('/edit/:modules',
    // [check('name').isLength({min:5}).withMessage("Module Name must be at least 5 characters")],
    // check('credits').isFloat({min:5, max:15}).withMessage("Credits can be either 5, 10 or 15"),
    // (req, res) => {
    //     var errors = validationResult(req)
    //     if(!errors.isEmpty()) {
    //         res.render(__dirname + '/edit', {errors:errors.errors, mid:req.body.mid, name:req.body.name, credits:req.body.credits})
    //     }
    //     else{
    //         console.log(req.body);
    //         mySQL.changeModule.push({mid:req.body.mid, name:req.body.name, credits:req.bodt.credits})
    //         res.redirect('/listmodules');
    //     }
    // })
})

app.get('/students/:student', (req, res) => {
    mySQL.getStudent()
        .then((result) => {
            console.log(result)
            res.render(__dirname + '/showStudent', { students: result })
        })
        .catch((error) => {
            console.log(error)
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

app.get('/addStudent', (req, res) => {
    mySQL.addStudent()
        .then((result) => {
            console.log(result)
            res.render(__dirname + '/addStudent', { lists: result })
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

app.post('/addLecturer', (req, res) => {
             mongoDAO.addLecturer(req.body._id, req.body.name, req.body.dept)
             .then((result) => {
                 res.redirect('/listmodules')
             })
             .catch((error) => {
                 if(error.message.includes("11000")) {
                     res.send("_id is already in use")
                 }
                 res.send(error.message)
             })
        })

app.listen(3000, () => {
    console.log("Listening on port 3000");
});