var express = require('express');
var router = express.Router();
var deviceCtr = require('../app/controller/device')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// GET ADD DEVICE PAGE
router.get('/add', function(req, res, next) {
  res.render('add-device',{
    result:{
      code:0,
      status:""
    }
  });
});


//  ADD DEVICE
router.post('/add', deviceCtr.addDevice);
// GET ALL DEVICE
router.get('/getDevice', deviceCtr.getDevice);
//GET DEVICE BY ID
router.get('/device/:id', deviceCtr.getDeviceById);
// GET SYSTEM TABLE
router.get('/system/:ip_address', deviceCtr.getSystem);

// DETETE DEVICE

router.delete('/delete/:id', deviceCtr.deleteDevice);

// alarm page

router.get('/alarm', function(req, res) {
  res.render('alarm');
});

router.get('/all/alarm', deviceCtr.getAllAlarm);

router.get('/snmp/:type/:ip', deviceCtr.getSnmpAlarm);

//get tx rx config
router.get('/tx/:ip', deviceCtr.getTxConfig);
router.get('/rx/:ip', deviceCtr.getRxConfig);

// update tx rx
router.post('/tx/config/:ip_address', deviceCtr.configTx);
router.post('/rx/config/:ip_address', deviceCtr.configRx);

module.exports = router;
