var Device = require('../model/device');
var Alarm = require('../model/alarm');
var async = require('async');
var snmp = require ("net-snmp");
const Monitor = require('ping-monitor');

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
            return res.redirect('/device/'+device._id);

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

exports.getSnmpAlarm = function (req, res) {
    var ip = req.params.ip;
    var type = req.params.type;
    var options = {
        port: 161,
        retries: 1,
        transport: "udp4",
        trapPort: 162,
        timeout: 1000,
        version: snmp.Version1,
        idBitsSize: 32
    };

    var session = snmp.createSession(ip, "public", options);

    var oid = "1.3.6.1.4.1.22154.3.1.2.5.1.1.0";  // tx
    if(type == 1){
        oid = "1.3.6.1.4.1.22154.3.1.2.5.2.1.0"  // rx
    }
    var oids = [oid];

    session.get (oids, function (error, varbinds) {
        if (error) {
            res.json({
                code: 1
            })
        } else {
            for (var i = 0; i < varbinds.length; i++) {
                if (snmp.isVarbindError(varbinds[i])) {
                    res.json({
                        code: 1
                    })
                } else {
                    var buf = varbinds[0].value;
                    var json = buf.toJSON(buf);
                    var data_buf = json.data;
                    var buffer_data = "";
                    for (var k = 0; k < data_buf.length; k++) {
                        var bin = data_buf[k].toString(2);
                        while (bin.length < 8) {
                            bin = "0" + bin;
                        }
                        buffer_data = buffer_data + bin;
                    }
                    var result = convertToAlarm(buffer_data, oid);
                    res.json({
                        code: 0,
                        result: result
                    })
                }
            }
        }
        session.close ();
    });

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
            requset(
                {
                uri: 'http://'+device.ip_address
                },
                function (err, response, body) {
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
    },function (err, response, body) {
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
    Alarm.find({}).sort({_id: -1}).exec(function (error,alarms ) {
        if(!error) {
            res.json({
                code: 1,
                result: alarms
            })
        }
    })
}

function getNewDeviceAlarm(ip, callback) {
    var options = {
        port: 161,
        retries: 1,
        transport: "udp4",
        trapPort: 162,
        timeout: 1000,
        version: snmp.Version1,
        idBitsSize: 32
    };

    var session = snmp.createSession(ip, "public", options);

    var oids = ["1.3.6.1.4.1.22154.3.1.2.5.2.7.0"];

    session.get (oids, function (error, varbinds) {
        if (error) {
            console.error (error);
            callback();
        } else {
            for (var i = 0; i < varbinds.length; i++)
                if (snmp.isVarbindError (varbinds[i])){
                    console.log('loi roi')
                    callback();
                }
                else{
                    var buf = varbinds[i].value;
                    var json = buf.toJSON(buf);
                    var data_buf = json.data;
                    var buffer_data = "";

                    for( var k = 0; k < data_buf.length; k ++) {
                        var bin = data_buf[k].toString(2);
                        while(bin.length < 8) {
                            bin = "0" + bin;
                        }
                        buffer_data = buffer_data+bin;
                    }
                    callback(buffer_data);
                }
        }
        session.close ();
    });
}

function convertToAlarm(bit, oid) {
    var  TX_ALARMS =  ["txAlarm", "txPaModuleAlarm", "txModModuleAlarm", "txFrontModuleAlarm",
        "txMainModuleAlarm","txExternalAlarm","txForcedAlarm","txExtUnitAlarm",
        "txPASWRAlarm","txPACurrentAlarm","txPATemperatureAlarm","txPA28V0Alarm",
        "txPA12V0Alarm","txPA5V0Alarm","txPA3V3Alarm","txPA5V0Neg",
        "txPAFanFailure", "txPAPwrOutAlarm","txRFTuneAlarm","txModLoLvlAlarm",
        "txModLoLockAlarm","txMod6V0Alarm","txPowerACAlarm","txMainInStby",
        "txMainEthernetAlarm","txMainCodecAlarm","txMainSPIAlarm",
        "txMainFrontAlarm","txMainRemExpAlarm","txMainBiteADCAlarm",
        "txMainMemAlarm","txSpareAlarm31"];

    var  RX_ALARMS = ["rxAlarm", "rxRfModuleAlarm", "rxPowerModuleAlarm", "rxFrontModuleAlarm",
        "rxMainModuleAlarm","rxExternalAlarm","rxForcedAlarm","rxSpareAlarm7",
        "rxRFLoLvlAlarm","rxRFLoLockAlarm","rxRF6V0Alarm","rxRFLNACurrentAlarm",
        "rxRFIFCurrentAlarm","rxRF30V0Alarm","rxSpareAlarm14","rxPowerACAlarm",
        "rxPower12V0Alarm","rxPower5V0Alarm","rxPower3V3Alarm","rxPowerAlarm",
        "rxPowerCurrentAlarm","rxPowerDCInputAlarm","rxCodecLDAlarm","rxMainAGCAlarm",
        "rxMainEthernetAlarm","rxMainCodecAlarm","rxMainSPIAlarm",
        "rxMainFrontAlarm","rxMainRemExpAlarm","rxMainBiteADCAlarm",
        "rxMainMemAlarm","rxMainIFAlarm"]
    // bit = "11000000100000000000000100000000";
    var arr = bit.split("");
    var result = [];
    for(var i = 0; i < arr.length; i++) {
        if(arr[i] == "1") {
            if(oid == "1.3.6.1.4.1.22154.3.1.2.5.1.1.0" || oid == "1.3.6.1.4.1.22154.3.1.2.5.1.1.0") {
                result.push(TX_ALARMS[i]);
            } else {
                result.push(RX_ALARMS[i]);
            }
        }
    }
    return result;
}