var express = require('express');
var empModel = require('../modules/employee');
var router = express.Router();

var employee = empModel.find({});

/* GET home page. */
router.get('/', function(req, res, next) {
  employee.exec((err, data)=>{
    if(err) throw err;
    res.render('index', { title: 'Employee Records', records: data });

  });
});


//For Data Insertion
router.post('/', (req, res, next)=>{
  var employeeDetails = new empModel({
    name: req.body.name,
    email: req.body.email,
    etype: req.body.etype,
    hourlyrate: req.body.hourlyrate,
    totalhour: req.body.totalhour,
    total: parseInt(req.body.hourlyrate) * parseInt(req.body.totalhour)
  });
  employeeDetails.save((err, res1)=>{
    if (err) throw err;
    employee.exec((err, data)=>{
      if(err) throw err;
      res.render('index', {title: 'Employee Records', records: data });
    });

  });

});


//For Data Filter
router.post('/search/', (req, res, next)=>{
  
  var flrtName = req.body.byname;
  var flrtEmail = req.body.byemail;
  var flrtemptype = req.body.byemptype;

  if(flrtName != '' && flrtEmail != '' && flrtemptype != ''){
    var flterParameter = {
      $and: [{name: flrtName}, {$and: [{email: flrtEmail}, {etype: flrtemptype}]}]
    }

  }else if(flrtName != '' && flrtEmail == '' && flrtemptype != ''){
    var flterParameter = {
      $and: [{name: flrtName}, {etype: flrtemptype}]
    }
  }else if(flrtName == '' && flrtEmail != '' && flrtemptype != ''){
    var flterParameter = {
      $and: [{email: flrtEmail}, {etype: flrtemptype}]
    }
  }else if(flrtName == '' && flrtEmail == '' && flrtemptype != ''){
    var flterParameter = { etype: flrtemptype }
  }else{
    var flterParameter = {}
  }

  var employeeFilter = empModel.find(flterParameter);

  employeeFilter.exec((err, data)=>{

    if(err) throw err;
    res.render('index', {title: 'Employee Records', records: data});
  
  }); 


});


//For Data Delete
router.get('/delete/:id', (req, res, next)=>{
  var id = req.params.id;
  var del = empModel.findByIdAndDelete(id);

  del.exec((err)=>{
    if(err) throw err;
    res.redirect('/');
  });

});




//For Data Edit
router.get('/edit/:id', (req, res, next)=>{
  var id = req.params.id;
  var edit = empModel.findById(id);
  edit.exec((err, data)=>{
    if(err) throw err;
    res.render('edit', {title: 'Edit Employee Records', records: data});
  });

});

//For Data Update
router.post('/update/', (req, res, next)=>{
  var update = empModel.findByIdAndUpdate(req.body.id, {
    name: req.body.name,
    email: req.body.email,
    etype: req.body.etype,
    hourlyrate: req.body.hourlyrate,
    totalhour: req.body.totalhour,
    total: parseInt(req.body.hourlyrate) * parseInt(req.body.totalhour)

  });
  update.exec((err, data)=>{
    if(err) throw err;
    res.redirect('/');
  });

});


//For Image Upload
// router.get('/image/', (req, res, next)=>{
//   res.send('HEllo');
// });

module.exports = router;








