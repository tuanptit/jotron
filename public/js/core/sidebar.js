$(document).ready(function () {
    function getAllEmployees() {
        $.ajax('/getDevice', {
            method: 'GET'
        }).success(function (res) {
            if (res.code == '0') {
                var listMux = res.result;
                fillMuxToSidebar(listMux);
                var id_device = $('#mux-name').attr('data-id');
                $('#'+id_device).addClass('active');
            }
            else {
                console.log(res.status);
            }
        }).error(function (err) {
            console.log(err);
        });
    }

    function fillMuxToSidebar(muxs) {
        for(var i = 0; i < muxs.length; i++) {
            $("#dynamic-sidebar").prepend('<li id="'+muxs[i]._id+'" class="abc"><a href="/device/'+muxs[i]._id+'">'+muxs[i].name+'</a></li>')
        }
    }
    getAllEmployees();
});

