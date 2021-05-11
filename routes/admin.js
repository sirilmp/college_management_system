const { response } = require('express');
var express = require('express');
var router = express.Router();
var accountHelpers = require('../helpers/account-helpers');
var admin = true;

/* GET users listing. */
router.get('/', (req, res) => {
  accountHelpers.getTeachersData().then((teachersValues) => {
    accountHelpers.getstaffsData().then((staffsValues) => {
      //console.log(teachersValues);
      res.render('admin/home-data', { admin, staffsValues, teachersValues })
    })
  })

});


router.get('/create-staffs-account', (req, res) => {
  res.render('admin/create-accounts/create-office-staff-account', { admin })
});


//staffs account data storing
router.post('/add-staff-data', (req, res) => {
  //console.log(req.body);

  console.log(req.files.ProfileImage);
  accountHelpers.addStaffsData(req.body).then((id) => {
    let image = req.files.ProfileImage
    image.mv('./public/images/office-staffs/' + id + '.jpg', (err, done) => {
      if (!err) {
        res.render('admin/create-accounts/create-office-staff-account', { admin })
      }
      else {
        console.log(err);
      }
    })
  })


});

//teachers account createing page
router.get('/create-teachers-account', (req, res) => {
  res.render('admin/create-accounts/create-teachers-account', { admin })
});


//teachers account data storing
router.post('/add-teachers-data', (req, res) => {
  accountHelpers.addTeachersData(req.body).then((id) => {
    console.log(req.body);
    let image = req.files.ProfileImage
    image.mv('./public/images/teachers/' + id + '.jpg', (err, done) => {
      if (!err) {
        res.render('admin/create-accounts/create-teachers-account', { admin })
      }
      else {
        console.log(err);
      }
    })
  })
});

router.get('/create-librarian-account', (req, res) => {
  res.render('admin/create-librarian-account', { admin })
});


//Teachers page rendering
router.get('/teachers', (req, res) => {
  accountHelpers.getTeachersData().then((teachersValues) => {
    res.render('admin/sub-pages/teachers', { admin, teachersValues })
  })
});
//stafs page rendering
router.get('/staffs', (req, res) => {
  accountHelpers.getstaffsData().then((staffsValues) => {
    res.render('admin/sub-pages/staffs', { admin, staffsValues })
  })
})
module.exports = router;
