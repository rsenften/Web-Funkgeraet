class Device {
    constructor() {
        this.device_id = "0123456789";
        this.current_channel = 0;
        this.coordinate_N = '25°48N';
        this.coordinate_W = '80°12W';
        this.country = 'USA';
        this.power = '25W';
        this.stand_by = true;
        this.time = '12:00';
        this.render_display();
    }


    render_display() {
        $('#channel').html(Math.round(this.current_channel));
        $('#time').html(this.time);
        $('#coordinate_N').html(this.coordinate_N);
        $('#coordinate_W').html(this.coordinate_W);
        $('#power').html(this.power);
        $('#country').html(this.country);
        $('#btn_1_description').html("SCAN");
        $('#btn_2_description').html("DW");
        $('#btn_3_description').html("CH/WX");
        $('#btn_4_description').html("HI/LO");
        $('#standby').html("STBY");
    }
}
// ----------------------------------------------------------------------

$('#btnScan, #btnDW, #btnCH_WX, #btnHI_LO, #btn_16_c').mousedown( function() {
    $(this).css({'width': '90%',
                 'height': '90%'});
});

$('#btnScan, #btnDW, #btnCH_WX, #btnHI_LO, #btn_16_c').mouseup(function() {
    $(this).css({'width': '100%',
                 'height': '100%'});
    let color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
    $('body').css({'background-color': color});
});

// ----------------------------------------------------------------------

var device = new Device();

installRotateOf('control_wheel_img', function (cr, lastAngle) {
    if(cr < lastAngle){
        device.current_channel -= 0.1;
    }
    else {
        device.current_channel += 0.1;
    };

    if(device.current_channel >= 68){
        device.current_channel = 0;
    };
    if(device.current_channel < 0){
        device.current_channel = 68;
    };

    device.render_display();
});
