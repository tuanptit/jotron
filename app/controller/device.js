var Device = require('../model/device');
var Alarm = require('../model/alarm');
var async = require('async');
exports.addDevice = function (req, res) {
    var device = new Device({
        name: req.body.name,
        ip_address: req.body.ip_address,
        read_community: req.body.read_community,
        write_community: req.body.read_community
    });

    device.save(function (err) {
        if(err) {
            res.json({
                code: 0
            })
        } else {
            res.render('add-device', { result: {
                    code:1,
                    status: 'Thêm thiết bị thành công'
                }
            });
        }
    })
}

exports.getDevice = function(req, res) {
    Device.find({},
        function (err, muxs) {
            if(err) {
                res.json({
                    code: 1,
                    result:'err'
                })
            } else {
                var list =[];
                for(var i = 0; i, i < muxs.length; i++) {
                    var mMux = {
                        id: muxs[i]._id,
                        name: muxs[i].name,
                        ip_address: muxs[i].ip_address,
                        read_community: muxs[i].read_community,
                        write_community: muxs[i].write_community
                    }
                    list.push(mMux);
                }
                res.json({
                    code:0,
                    result: muxs
                });
            }
        })
}

exports.getDeviceById = function(req, res) {
    var id = req.params.id;
    Device.findOne({
        _id: id
    }, function (err, device) {
        if(err) {
            res.json({
                code: 1,
                result:'err'
            })
        } else {
            var requset = require('request');
            requset({
                uri: 'http://'+device.ip_address
            }, function (err, response, body) {
                var jsdom = require('jsdom');
                const { JSDOM } = jsdom;
                const { window } = new JSDOM(body);
                var $ = require('jquery')(window);
                var item  = {
                    radio_type:  $('body').find('table:eq(1)').find('td:eq(1)').text(),
                    serial_number: $('body').find('table:eq(1)').find('td:eq(3)').text(),
                    radio_id: $('body').find('table:eq(1)').find('td:eq(5)').text(),
                    sw_version: $('body').find('table:eq(1)').find('td:eq(9)').text()
                }
                device.radio_type = item.radio_type;
                device.serial_number = item.serial_number;
                device.radio_id = item.radio_id;
                device.sw_version = item.sw_version;
                console.log(device);
                res.render('device-detail', {result: device})
            });
        }
    })
}

exports.getSystem = function (req, res) {
    var ip_address = req.params.ip_address;
    var requset = require('request');
    requset({
        uri: 'http://'+ip_address+'/system.html'
    }, function (err, response, body) {
        var jsdom = require('jsdom');
        const { JSDOM } = jsdom;
        const { window } = new JSDOM(body);
        var $ = require('jquery')(window);

        var tbl_state = [];
        $('body').find('table:eq(2)').find('tr td').each(function(col, td) {
            tbl_state.push($(td).text());
        });


        var tbl_bit = [];
        $('body').find('table:eq(3)').find('tr td').each(function(col, td) {
            tbl_bit.push($(td).text());
        });
        tbl_bit = tbl_bit.filter(item => item);

        var tbl_modulator = [];
        $('body').find('table:eq(4)').find('tr td').each(function(col, td) {
            tbl_modulator.push($(td).text());
        });
        tbl_modulator = tbl_modulator.filter(item => item);


        var list = {
            tbl_state: tbl_state,
            tbl_bit: tbl_bit,
            tbl_modulator: tbl_modulator,
        }



        res.json({
            result: list
        })
    });
}

exports.deleteDevice = function (req, res) {
    var deviceId = req.params.id;
    Device.remove({
        _id: deviceId
    }, function (err) {
        if (err) {
            res.json({
                status: 'fail',
                message: err
            });
        } else {
            res.json({
                code: 1
            })
        }
    });
}

exports.getAllAlarm = function (req, res) {
    var list = [];
    Alarm.find({}).sort({_id: -1}).exec(function (error, alarms) {
        if(!error) {
            async.eachSeries(alarms, function (alarm, callback) {
                Device.findOne({
                    ip_address: alarm.ip_address
                }, function(err, device){
                   var name = device.name;
                   var date = alarm.date;
                   var error = alarm.error;
                   var item = {
                       name: name,
                       date: date,
                       error: error
                   }
                   list.push(item);
                   callback();
                });
            }, function() {
                res.json({
                    code: 1,
                    result: list
                })
            });
        }
    })
}