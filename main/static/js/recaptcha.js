"use strict";
console.log("reCaptcha-Test loading...");

const BASE_URL = "https://matrix.org";

// accessToken of tf001:
const TOKEN = "MDAxOGxvY2F0aW9uIG1hdHJpeC5vcmcKMDAxM2lkZW50aWZpZXIga2V5CjAwMTBjaWQgZ2VuID0gMQowMDI0Y2lkIHVzZXJfaWQgPSBAdGYwMDE6bWF0cml4Lm9yZwowMDE2Y2lkIHR5cGUgPSBhY2Nlc3MKMDAyMWNpZCBub25jZSA9IE1rZEVjZ1NIaXJ6M2lCXksKMDAyZnNpZ25hdHVyZSAS7IR5qcvcqswWFAEq0feE8A7qD3UueE_1Q1HdJ_CFDgo";

const PUBLIC_KEY = "6LcgI54UAAAAABGdGmruw6DdOocFpYVdjYBRe4zb";


// Room "talent-factory":
const ROOM_ID_TF = "!IDTxyVLBWnjXswzvrA:matrix.org";
// SiteKey for the reCaptcha:
const matrixSiteKey = "6LcgI54UAAAAABGdGmruw6DdOocFpYVdjYBRe4zb";

var USER_ID;
var PASSWD;
var client;

var username;
var session = "undefined";
var captchaResponse = "undefined";

//window.onloadend = function() {
$(document).ready(function () {
    console.log("--> Document ready...");
    initClient();
});

function initClient() {
    $('#reg-info').on("click", function() { reg_info_Clicked() });
    $('#reg-recap').on("click", function() { reg_recap_Clicked() });
    $('#reg-dummy').on("click", function() { reg_dummy_Clicked() });
    $('#reg-terms').on("click", function() { reg_terms_Clicked() });

    client = matrixcs.createClient({
        baseUrl: BASE_URL,
    });

    PASSWD = "Bernapark-ZID-TFAG";
    console.log("Password is: " + PASSWD);
    console.log("--> initClient done.");

}

function reg_info_Clicked() {
    username = $('#username').val();
    setResult("Username: " + username);

    client.register(username, PASSWD)
        .then((r) => setResult("This will never happen ;-)"))
        .catch((r) => registerFailed(r));
}

function registerFailed(response) {
    setResult("register Failed, response = " + JSON.stringify(response));

    // got the session?
    var txt = response.data.session;
    if  (txt) {
        session = txt;
        $("#sessionId").html("session: " + txt);
    }

    // got the public key for reCaptcha?
    txt = response.data.params["m.login.recaptcha"].public_key;
    if  (txt) {
        //PUBLIC_KEY = txt;
        $("#publicKey").html("siteKey: " + txt);
    }
    // NOW RESOLVE THE CAPTCHA...
}

// This function is referenced in the template 'recaptcha.html'
function reCaptchaCallback(response) {
    if (response) {
        captchaResponse = response;
        let txt = "reCaptcha response = " +response;
        $("#recaptchaKey").html(txt);
        console.log(txt);
    }
}

function reg_recap_Clicked() {
    let auth = {
        "type": "m.login.recaptcha",
        "response": captchaResponse,
        "session": session
    };
    client.register(username, PASSWD, session, auth, false, {}, false)
        .then((r) => registerWithAuthResult(r))
        .catch((r) => registerWithAuthFailed(r));
}

function reg_dummy_Clicked() {
    let auth = {
        "type": "m.login.dummy",
        "session": session
    };
    client.register(username, PASSWD, session, auth)
        .then((r) => registerWithAuthResult(r))
        .catch((r) => registerWithAuthFailed(r));
}

function reg_terms_Clicked() {
    let auth = {
        "type": "m.login.terms",
        "session": session
    };
    client.register(username, PASSWD, session, auth)
        .then((r) => registerWithAuthResult(r))
        .catch((r) => registerWithAuthFailed(r));
}

function registerWithAuthResult(response) {
    setResult("registerWithAuthResult: " + JSON.stringify(response));
    setResult2("You may now login with Username: '" + username + "' and Password: '" + PASSWD + "'");
}

function registerWithAuthFailed(response) {
    setResult("registerWithAuthFailed: " + JSON.stringify(response));
}


function setResult(result) {
    $("#result").html(result);
    console.log(result);
}

function setResult2(result) {
    $("#result2").html(result);
    console.log(result);
}

function logRooms() {
    var rooms = client.getRooms();
    rooms.forEach(room => {
        console.log(room.roomId);
    });
}


/*
Response from first register attempt:
-------------------------------------
response = {
    "name":"Unknown error code",
    "message":"Unknown message",
    "data":{
        "session":"KSnsWjBZstjewtUyoUTxprYH",
        "flows":[
            {"stages":[
                "m.login.recaptcha",
                "m.login.terms",
                "m.login.dummy"]
            },
            {"stages":[
                "m.login.recaptcha",
                "m.login.terms",
                "m.login.email.identity"]
            }
        ],
        "params":{
            "m.login.recaptcha":{
                "public_key":"6LcgI54UAAAAABGdGmruw6DdOocFpYVdjYBRe4zb"
            },
            "m.login.terms":{
                "policies":{
                    "privacy_policy":{
                        "version":"1.0","en":{
                            "name":"Terms and Conditions",
                            "url":"https://matrix.org/_matrix/consent?v=1.0"
                        }
                    }
                }
            }
        }
    },
    "httpStatus":401
}

 */

