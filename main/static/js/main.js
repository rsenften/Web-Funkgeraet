// ----------------------------------------------------------------------
// DEVICE CLASS DEFINITION

class Device {
    constructor() {
        this.device_id = "0123456789";
        this.current_channel = 16;
        this.coordinate_N = '25°48N';
        this.coordinate_W = '80°12W';
        this.country = 'USA';
        this.power = '25W';
        this.stand_by = true;
        this.time = '12:00';
        this.volume = 5;
        this.squelch = 5;
        this.render_display();
    }


    render_display() {
        let channel = Math.round(this.current_channel);

        if ((channel+ "").length == 1) { // if channel number only has one digit, add 0 (e.g: 1 => '01')

            channel = '0'+channel;
        };
        $('#channel').html(channel);

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

    render_vol_dialogue() {
        let bar_width = Math.round(this.volume)*5;
        $('#vol_number').html(Math.round(this.volume));
        $('#vol_dialogue').css('display', 'inline');
        $('#vol_bar_progress').css('width', bar_width+'%');
        this.hide_sql_dialogue();
        $('#display_left_col, #display_right_col').css('visibility', 'hidden');
        $('#display_left_col, #display_right_col').css('display', 'none');

    }

    hide_vol_dialogue() {
        $('#vol_dialogue').css('display', 'none');
        $('#display_left_col, #display_right_col').css('visibility', 'visible');
        $('#display_left_col, #display_right_col').css('display', 'block');
    }

    render_sql_dialogue() {
        let bar_width = Math.round(this.squelch)*5;
        $('#sql_number').html(Math.round(this.squelch));
        $('#sql_dialogue').css('display', 'inline');
        $('#sql_bar_progress').css('width', bar_width+'%');
        this.hide_vol_dialogue();
        $('#display_left_col, #display_right_col').css('visibility', 'hidden');
        $('#display_left_col, #display_right_col').css('display', 'none');

    }

    hide_sql_dialogue() {
        $('#sql_dialogue').css('display', 'none');
        $('#display_left_col, #display_right_col').css('visibility', 'visible');
        $('#display_left_col, #display_right_col').css('display', 'block');
    }

}

var device = new Device();

// ----------------------------------------------------------------------
// BUTTON EVENT LISTENERS

$('#btnScan, #btnDW, #btnCH_WX, #btnHI_LO, #btn_16_c').mousedown( function() {
    $(this).css({'width': '95%',
                 'height': '95%'});
});

$('#btnScan, #btnDW, #btnCH_WX, #btnHI_LO, #btn_16_c').mouseup(function() {
    $(this).css({'width': '100%',
                 'height': '100%'});
});

$('#btnHI_LO').click(function () { // This soft key toggles the device power
    if (device.power == '1W') {
        device.power = '25W';
    }

    else {
        device.power = '1W';
    };
    device.render_display();
});

$('#btn_16_c').click(function () { // This changes the current channel to 16
    device.current_channel = 16;
    device.render_display();
});

// ----------------------------------------------------------------------
// REGULATION OF VOLUME AND SQUELCH (USING THE CONTROL WHEEL)

// The mechanism does not yet work exactly as specified in the device manual. ==> Evaluate with Daniel


// toggles visibility of squelch/volume dialogues (depending on the amount of clicks (1 or 2))
$('#control_wheel_img').mousedown(function (e) {

      if(e.originalEvent.detail == 2){
        device.hide_vol_dialogue();
        device.render_sql_dialogue();
        return;
      };
        device.hide_sql_dialogue();
        device.render_vol_dialogue();

});

// hides squelch and volume dialogues as soon as the mouse is released (with a delay of 500ms)
$('body').mouseup(function (e) {
    setTimeout(function () {
    device.hide_sql_dialogue();
    device.hide_vol_dialogue();
    }, 500)
});


// call the installRotateOf function (located in wheel_mechanics.js) and defines its handler
installRotateOf('control_wheel_img', function (cr, lastAngle) {

    let sensitivity_coefficient = 0.1; // this value regulates the sensitivity of the control wheel

    if ($('#vol_dialogue').css('display') == 'none') { // if the vol_dialogue is not displayed, regulate squelch

        if(cr < lastAngle && device.squelch > 0) {device.squelch -= sensitivity_coefficient;};

        if(cr > lastAngle && device.squelch < 20) {device.squelch += sensitivity_coefficient;};

        device.render_sql_dialogue();}
    
    else { // if the sql_dialogue is not displayed, regulate volume

        if(cr < lastAngle && device.volume > 0) {device.volume -= sensitivity_coefficient;};

        if(cr > lastAngle && device.volume < 20) {device.volume += sensitivity_coefficient;};

        device.render_vol_dialogue();}
    });
