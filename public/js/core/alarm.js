$(document).ready(function () {
    $('#alarm-page').addClass('active')
    var t = $("#tbl-list-alarm").DataTable({
        "retrieve": true,
        "lengthMenu": [5, 10, 50, 100],
        "pageLength": 30,
        "scrollX": true,
        dom: 'Bfrtip',
        "ordering": false,
        buttons: [
        ]
    });
    var ajax1 = $.ajax('/all/alarm', {
        method: 'GET',
        beforeSend: function (){
            $('body').append('<div class="overlay"><div class="opacity"></div><i class="icon-spinner3 spin"></i></div>');
            $('.overlay').fadeIn(150);
        }
    }).success(function (res) {
        console.log('alarm page')
        window.setTimeout(function(){
            $('.overlay').fadeOut(150, function() {
                $(this).remove();
            });
        },50);
        if(res.code == 1) {
            var data = res.result;
            console.log(data);
            addDataToTable(data)
        }

    }).error(function (err) {
        console.log(err);
    });

    function addDataToTable(data) {
        console.log(data)
        if(data.length != 0) {
            t.clear();
            data.forEach(function (value, index) {
                var oid = "Unknown Error";
                var value_data = "Unknown Value";
                var name = "<span style='padding: 9px; font-size: 13px;' class='label label-success'>"+value.name+"</span>";
                var error = "<span style='padding: 9px; font-size: 13px;' class='label label-danger'>"+value.error+"</span>";
                var date = "<span style='padding: 9px; font-size: 13px;' class='label label-default'>"+value.date+"</span>";

                if(isNaN(parseInt(value_data))) {
                    t.row.add([name, error, date]).draw(false);
                }
            })
        } else {
            $('#tbl-list-alarm').empty();
        }
    }
});

function getAlarmStatusALl(value) {
    var state = ["off","major","minor","event","warning","critical"];
    return state[value-2];
}

function getBufferAlarm(code) {
    var message = ["","HARDWARE FAILURE SLOT i","LOCAL SYNC LOSS","B.R.G FAILURE, SLOT i","PS-A 5V FAILURE","PS-A 12V FAILURE",
        "PS-B 5V FAILURE","PS-B 12V FAILURE","DB 1 CHKSUM ERROR - DB 2 CHKSUM ERROR","DB 1 CHKSUM ERROR - DB 2 CHKSUM ERROR",
        "BANDWIDTH OVERFLOW","ALARM BUFFER OVERFLOW","CLOCK WAS CHANGED TO FALLBACK","CLOCK WAS CHANGED TO INTERNAL","CL HARDWARE FAILURE","",
        "POWER SUPPLY A REMOVED","I/O SYNC LOSS, SLOT i ","MAIN LINK FLIP OCCURRED","ML LOSS OF SIGNAL, SLOT i","MODULE WAS REMOVED, SLOT i",
        "MAIN LINK BACKUP DIAL FAILURE","SWITCHED BACKUP ML IS ACTIVE ","MAIN LINK RECOVERY","MAIN LINK FLIP, ML-A","MAIN LINK FLIP, ML-B",
        "DATABASE SWITCH TO DB1","DATABASE SWITCH TO DB2","PSWRD SWITCH IS ON","POWER SUPPLY B REMOVED","DB-INIT SWITCH IS ON","REAL TIME CLOCK BATTERY FAILURE",
        "VOICE SYNC LOSS, CH ","TAIL-END MODEM ON LOOP, CH","","IDLE SEQUENCE, SLOT i ","ML OUT OF SERVICE, SLOT i","ML OUT OF FRAME, SLOT i ","DSU LOOPBACK, SLOT i ",
        "KTRE/KMBE LINK ERROR SLOT i","KTRE/KMBE LAN ERROR, SLOT i ","KDI FRAME OVERFLOW","PIGGY-BACK HARDWARE ERROR A ","NETWORK LLB, SLOT i ",
        "NETWORK PLB, SLOT i ","DRIVER FAIL, SLOT i ","SIGNAL LOSS, SLOT i ","EXCESSIVE BPV, SLOT i","AIS OCCURRED, SLOT i","AIS RED ALM, SLOT i ",
        "AIS SYNC LOSS,SLOT i ","RED ALARM, SLOT i ","E1 LOCAL SYNC LOSS, SLOT i","LOCAL MF S.LOSS, SLOT i","REMOTE MF S.LOSS, SLOT i","YELLOW ALARM, SLOT i ",
        "E1 REMOTE SYNC LOSS SLOT i ","FRAME SLIP, SLOT i ","BPV ERROR, SLOT i","EXCESSIVE ERR RATIO, SLOT i","CRC-4 ERROR, SLOT i","SFIFO B.R.G FAIL, SLOT i","SFIFO SLIP, SLOT i",
        "INTERNAL CLOCK IN USE","DP CYCLE DIAL FAILED ","DP PRIMARY CALL FAILED","DP ALTERNATE CALL FAILED","FRAMER CARD FAILED ","MGMT PORT IS LOOPED",
        "MGMT PORT IS DOWN","AGENTS WITH SAME NAME IN NET","CONTROL TAKEN BY SNMP MMI "," "," ","KCL WARE ERROR:KCL","HARDWARE ERROR:IO-i ","HARDWARE ERROR:ML-i",
        "ALARM BUFFER EMPTY"," ","RED ALARM, SLOT","YELLOW ALARM, SLOT","FRAME SLIP, SLOT:","BPV ERROR, SLOT","PHASOR OVERFLOW, SLOT","PORT SYNC LOSS, PORT ",
        "FANS FAILURE","PORT LOSS OF SIGNAL","OVERFLOW, PORT: ","VOICE SYNC LOSS, PORT","","SIGNAL LOSS, SLOT: ","AIS ALARM, SLOT: ","AIS RED ALARM, SLOT: ","","",
        "TDM DEVICE SLIP, PORT: ","REMOTE SYNC LOSS, PORT:","CCS COMPRESSION OVERFLOW PORT ","JITTER BUFFER UNDERFLOW","JITTER BUFFER OVERFLOW ",
        "SEQUENCE ERROR","FCS ERROR","ALIGNMENT ERROR","RINGER VOLTAGE FAILURE"];
    return message[code];
}