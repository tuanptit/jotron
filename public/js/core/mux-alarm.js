$(document).ready(function () {
    $("#get-system").on('click', function () {
        var ip_address = $('#device-ip').text();
        var ajax1 = $.ajax('/system/'+ip_address, {
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
            var data = res.result;
            var tbl_state = data.tbl_state;
            var tbl_bit = data.tbl_bit;
            var tbl_modulator = data.tbl_modulator;



            $('#tbl-state table thead tr').empty();
            for(var i = 0; i < tbl_state.length; i++) {
                if(i%2==0) {
                    $('#tbl-state table thead tr').append("<th class='text-center'>"+tbl_state[i].slice(0,-1)+"</th>");
                }
            }

            $('#body-state tr').empty();

            for(var i = 0; i < tbl_state.length; i++) {
                if(i%2!=0) {
                    $('#body-state tr').append("<th class='text-center'><span class='label "+getLable()+"'>"+tbl_state[i]+"</span></th>");
                }
            }
            var data_bit = listToMatrix(tbl_bit, 3);

            $('#body-bit').empty();
            for(var i = 0; i < data_bit.length; i++) {
                $('#body-bit').append("<tr>" +
                    "<th>"+data_bit[i][0].slice(0,-1)+"</th>"+
                    "<th><span class='label "+getLable()+"'>"+data_bit[i][1]+"</span></th>"+
                    "<th><span class='label label-success'>"+data_bit[i][2]+"</span></th>"+
                    "</tr>")
            }

            var data_modulator = listToMatrix(tbl_modulator, 3);
            $('#body-modulator').empty();
            for(var i = 0; i < data_modulator.length; i++) {
                $('#body-modulator').append("<tr>" +
                    "<th><span>"+data_modulator[i][0]+"</span></th>"+
                    "<th><span class='label "+getLable()+"'>"+data_modulator[i][1]+"</span></th>"+
                    "<th><span class='label label-success'>"+data_modulator[i][2]+"</span></th>"+
                    "</tr>")
            }
            // $("#get-system").off('click');
        }).error(function (err) {
            console.log(err.toString());
        });
    });


    $("#btn-delete").unbind();
    $("#btn-delete").click(function (e) {
        e.preventDefault();
        var id_device = $(this).attr("device-id");
        console.log(id_device);
        $("#confirm").attr("device-id", id_device);
    });

    $("#confirm").unbind();
    $("#confirm").click(function () {
        var idDevice = $(this).attr("device-id");
        $("#myModal").modal("hide");
        deleteAsset(idDevice);
    });

    $("#btns-delete").on('click', function () {
        var id_device = $('#mux-name').attr('data-id');
        var ajax1 = $.ajax('/delete/'+id_device, {
            method: 'DELETE',
            beforeSend: function (){
                $('body').append('<div class="overlay"><div class="opacity"></div><i class="icon-spinner3 spin"></i></div>');
                $('.overlay').fadeIn(150);
            }
        }).success(function (res) {

        });
    });
});

function getLable() {
    var lable = ["label-info","label-warning","label-success","label-primary","label-default"]

    return lable[Math.floor((Math.random() * 4) + 1)];
}

function listToMatrix(list, elementsPerSubArray) {
    var matrix = [], i, k;

    for (i = 0, k = -1; i < list.length; i++) {
        if (i % elementsPerSubArray === 0) {
            k++;
            matrix[k] = [];
        }

        matrix[k].push(list[i]);
    }

    return matrix;
}

function deleteAsset(id) {
    $.ajax("/delete/" + id, {
        method: "DELETE"
    }).success(function (res) {
        if (res.code == "1") {
            window.location.href = "/"
        }
    }).error(function (err) {
        console.log(err);
    })
}
