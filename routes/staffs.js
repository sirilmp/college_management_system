// module.exports = router;
const { response } = require('express');
var express = require('express');
var staffsHelpers = require('../helpers/staffs-helpers');
const { post } = require('./admin');
var router = express.Router();
var staffs = true;

const verifyStaff = (req, res, next) => {
    if (req.session.loggedin) {
        next()
    } else {
        res.redirect('login')
    }
}



/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('staffs/home', { staffs });
});

router.get('/home', function (req, res, next) {
    let staff = req.session.staff
    // console.log(req.session.staff);
    res.render('staffs/home', { staffs, staff });
});

//staff loggin page
router.get('/login', (req, res) => {
    //console.log(req.session.loggedin);
    if (req.session.loggedin) {

        res.redirect('home')

    } else {

        res.render('staffs/login', { staffs, "loginErr": req.session.loginErr })

        req.session.loginErr = false
    }
});


//staff login
router.post('/login', (req, res) => {

    // console.log(req.body);

    staffsHelpers.doLoggedin(req.body).then((response) => {

        if (response.status) {

            req.session.loggedin = true

            req.session.staff = response.staff

            res.redirect('home')

        } else {
            req.session.loginErr = "Invalid Email or Password !"

            res.redirect('login')

        }
    });
})


//staff logout
router.get('/logout', (req, res) => {

    req.session.destroy()

    res.redirect('home')
})


//student data adding
router.post('/add-student-data', (req, res) => {

   console.log(req.body);

   console.log(req.files);

    staffsHelpers.addStudentsData(req.body).then((id) => {

        let image = req.files.ProfileImage

        image.mv('./public/images/students/' + id + '.jpg', (err, done) => {

            if (!err) {

                res.redirect('home')
            }
            else {

                console.log(err);
            }
        })
    })
});


//displaying student datas
router.get('/students/cs', (req, res) => {

    //console.log(studentsValue);

    staffsHelpers.getStudentsData().then((studentsValues) => {

        let staff = req.session.staff

        res.render('staffs/students-data/student', { staffs, staff, studentsValues })

        //console.log(studentsValues);

    })
});


//paymet page displaying
router.get('/fee-payments', (req, res) => {

    staffsHelpers.getStudentsFeeData().then((studentsValues) => {

        let staff = req.session.staff

        //console.log(studentsValues);

        res.render('staffs/students-data/fee-payments', { staffs, staff, studentsValues })

    })
});


//paymets data checking
router.post('/check-fee-data', (req, res) => {

    //console.log(req.body);
    let staff = req.session.staff

    staffsHelpers.checkFeeData(req.body).then((feeData) => {

        res.render('staffs/students-data/verify', { feeData, staff })

        // console.log(feeData);

    })
});


//payment data storing
router.post('/verified', (req, res) => {

    //console.log("hello");


    staffsHelpers.addFeeSatus(req.body).then(() => {

        //console.log(req.body);

        staffsHelpers.checkFeeData(req.body).then((feeData) => {

            let staff = req.session.staff

            //console.log(req.body);

            res.render('staffs/students-data/e-receipt', { feeData, staff })

            // console.log(feeData);

        })


    })

});


//
//creating students accounts
router.get('/create-students-account', (req, res) => {

    let staff = req.session.staff

    res.render('staffs/create-students-account')

});






module.exports = router;
