$(document).ready(function () {
    var ajax1 = $.ajax('/getDevice/', {
        method: 'GET',
        beforeSend: function (){
            $('body').append('<div class="overlay"><div class="opacity"></div><i class="icon-spinner3 spin"></i></div>');
            $('.overlay').fadeIn(150);
        }
    }).success(function (res) {
        window.setTimeout(function () {
            $('.overlay').fadeOut(150, function () {
                $(this).remove();
            });
        }, 50);
        var result = res.result;
        console.log(result)
        for(var i = 0; i < result.length; i++) {
            $('#list-device').append("<li id='"+result[i]._id+"' class='bg-success'>" +
                "<div class='top-info'>" +
                "<a href='/device/"+result[i]._id+"'>"+result[i].name+"</a>"+
                "</div>"+
                "<a href='/device/"+result[i]._id+"'><i class='icon-stats2'></i></a>"+
                "<span class='bottom-info bg-primary'>"+result[i].ip_address+"</span>"+
                "</li>")
        }
    });
    $("#home-page").addClass('active');
})