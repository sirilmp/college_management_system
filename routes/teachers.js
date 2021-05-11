const { response } = require('express');
var express = require('express');
var teachersHelpers = require('../helpers/teachers-helpers');
var router = express.Router();

var teachers = true;
//var teachers=true;

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('teachers/home', { teachers });
});

router.get('/home', function (req, res, next) {
    let teacher = req.session.teacher
    //console.log(teacher);
    res.render('teachers/home', { teachers, teacher });
});

router.get('/login', (req, res) => {
    //console.log(req.session.loggedin);
    if (req.session.loggedin) {
        res.redirect('home')
    } else {
        res.render('teachers/login', { teachers, "loginErr": req.session.loginErr })
        req.session.loginErr = false
    }
});

router.post('/login', (req, res) => {
//console.log(req.body);
    teachersHelpers.doLoggedin(req.body).then((response) => {
        if (response.status) {
            req.session.loggedin = true

            req.session.teacher = response.teacher
            res.redirect('home')
        } else {
            req.session.loginErr = "Invalid Email or Password !"
            res.redirect('login')

        }
    });


    router.get('/logout', (req, res) => {
        req.session.destroy()
        res.redirect('home')
    })

})
module.exports = router;
