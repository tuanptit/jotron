$(document).ready(function () {
    $('#config-device').on('click', function () {
        var type = $('#radio-id span').text().substring(0, 2);



        if(type == "TA") { // nếu là máy phát
            $('#tx-config').css("display","block");
            $('#rx-config').css("display","none");

            $.ajax('/tx/'+$('#device-ip span').text(), {
                method: 'GET',
                beforeSend: function (){
                    $('body').append('<div class="overlay"><div class="opacity"></div><i class="icon-spinner3 spin"></i></div>');
                    $('.overlay').fadeIn(150);
                }
            }).success(function (res) {
                window.setTimeout(function(){
                    $('.overlay').fadeOut(150, function() {
                        $(this).remove();
                    });
                },50);
                if(res.code == 1) {
                    var data = res.result;
                    console.log(data)
                    $('#tx-frequency').val(data.frequency);
                    $('#tx-power').val(data.tx_power);
                    $('#tx-modulation').val(data.modulation);
                    $('#tx-low-power-lv').val(data.low_power_lv);
                    $('#tx-force-alarm').val(data.force_alarm);
                    $('#tx-force-low').val(data.force_low_power);
                    $('#tx-force-ptt').val(data.force_ptt);
                    $('#tx-trap-port').val(data.trap_port)
                }

                $('#confirm-tx').unbind();

                $('#confirm-tx').on('click', function () {
                    $("#modal_tx").modal("hide");
                    var item = {
                        tx_frequency: $('#tx-frequency').val(),
                        tx_power: $('#tx-power').val(),
                        tx_modulation: $('#tx-modulation').val(),
                        tx_low_power_lv: $('#tx-low-power-lv').val(),
                        tx_force_alarm: $('#tx-force-alarm').val(),
                        tx_force_low_power: $('#tx-force-low').val(),
                        tx_force_ptt: $('#tx-force-ptt').val(),
                        tx_trap_port: $('#tx-trap-port').val()
                    }
                    $.ajax('/tx/config/'+$('#device-ip span').text(), {
                        method: 'POST',
                        data: item,
                        beforeSend: function (){
                            $('body').append('<div class="overlay"><div class="opacity"></div><i class="icon-spinner3 spin"></i></div>');
                            $('.overlay').fadeIn(150);
                        }
                    }).success(function (res) {
                        window.setTimeout(function(){
                            $('.overlay').fadeOut(150, function() {
                                $(this).remove();
                            });
                        },50);
                        if(res.code == 1) {
                            showNoti(10,"Update successful!")
                        } else { //code =0
                           showNoti(3,"Lỗi định dạng!")
                        }

                    }).error(function (err) {
                        console.log(err);
                    });
                })

            }).error(function (err) {
                console.log(err);
            });
        } else {
            $('#rx-config').css("display","block");
            $('#tx-config').css("display","none");

            $.ajax('/rx/'+$('#device-ip span').text(), {
                method: 'GET',
                beforeSend: function (){
                    $('body').append('<div class="overlay"><div class="opacity"></div><i class="icon-spinner3 spin"></i></div>');
                    $('.overlay').fadeIn(150);
                }
            }).success(function (res) {
                window.setTimeout(function(){
                    $('.overlay').fadeOut(150, function() {
                        $(this).remove();
                    });
                },50);
                if(res.code == 1) {
                    var data = res.result;
                    console.log(data)
                    $('#rx-frequency').val(data.frequency);
                    $('#rx-sn-sq-level').val(data.sq_level);
                    $('#rx-line-out').val(data.line_out);
                    $('#rx-force-mute').val(data.force_mute);
                    $('#rx-force-alarm').val(data.force_alarm);
                    $('#rx-force-sq').val(data.force_sq);
                    $('#rx-trap-port').val(data.trap_port);

                    $('#confirm-rx').unbind();
                    $('#confirm-rx').on('click', function () {
                        $("#modal_rx").modal("hide");
                        var item = {
                            rx_frequency: $('#rx-frequency').val(),
                            rx_sq_level: $('#rx-sn-sq-level').val(),
                            rx_line_out: $('#rx-line-out').val(),
                            rx_force_mute: $('#rx-force-mute').val(),
                            rx_force_alarm: $('#rx-force-alarm').val(),
                            rx_force_sq: $('#rx-force-sq').val(),
                            rx_trap_port: $('#rx-trap-port').val()
                        }

                        $.ajax('/rx/config/'+$('#device-ip span').text(), {
                            method: 'POST',
                            data: item,
                            beforeSend: function (){
                                $('body').append('<div class="overlay"><div class="opacity"></div><i class="icon-spinner3 spin"></i></div>');
                                $('.overlay').fadeIn(150);
                            }
                        }).success(function (res) {
                            window.setTimeout(function(){
                                $('.overlay').fadeOut(150, function() {
                                    $(this).remove();
                                });
                            },50);
                            if(res.code == 1) {
                                showNoti(10,"Update successful!")
                            } else { //code =0
                                showNoti(3,"Lỗi định dạng!")
                            }

                        }).error(function (err) {
                            console.log(err);
                        });


                    });

                } else {
                    showNoti(3,'Error! Please try again!')
                }

            }).error(function (err) {
                console.log(err);
            });
        }
        $("#config-device").off('click');
    });

});

function showNoti(type, text) {
    if (type == 1) {
        Lobibox.notify('info', {
            size: "mini",
            delay: 3000,
            position: 'bottom right',
            msg: text
        });
    }
    else if (type == 2) {
        Lobibox.notify('warning', {
            size: "mini",
            delay: 3000,
            position: 'bottom right',
            msg: text
        });
    }
    else if (type == 3) {
        Lobibox.alert('error', {
            size: "mini",
            delay: 3000,
            position: 'bottom right',
            msg: text
        });
    }
    else {
        Lobibox.notify('success', {
            size: "mini",
            delay: 3000,
            position: 'bottom right',
            msg: text
        });
    }
}