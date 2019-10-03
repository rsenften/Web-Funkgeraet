"use strict";
console.log("reCaptcha-Test loading...");

const BASE_URL = "https://matrix.org";

// accessToken of tf001:
const TOKEN = "MDAxOGxvY2F0aW9uIG1hdHJpeC5vcmcKMDAxM2lkZW50aWZpZXIga2V5CjAwMTBjaWQgZ2VuID0gMQowMDI0Y2lkIHVzZXJfaWQgPSBAdGYwMDE6bWF0cml4Lm9yZwowMDE2Y2lkIHR5cGUgPSBhY2Nlc3MKMDAyMWNpZCBub25jZSA9IE1rZEVjZ1NIaXJ6M2lCXksKMDAyZnNpZ25hdHVyZSAS7IR5qcvcqswWFAEq0feE8A7qD3UueE_1Q1HdJ_CFDgo";

const PUBLIC_KEY = "6LcgI54UAAAAABGdGmruw6DdOocFpYVdjYBRe4zb";

const SESSION = "qicIDQjCduEMruLMoRXANgts";

// Room "talent-factory":
const ROOM_ID_TF = "!IDTxyVLBWnjXswzvrA:matrix.org";

var USER_ID;
var PASSWD;
var client;

var sessionId;
var username;
var publicKey;

function logRooms() {
    var rooms = client.getRooms();
    rooms.forEach(room => {
        console.log(room.roomId);
    });
}

//window.onloadend = function() {
$(document).ready(function () {
    console.log("--> Document ready...");
    initClient();
});

function initClient() {
    $('#register').on("click", function() { registerClicked() });
    $('#submit').on("click", function() { submitClicked() });
    $("#submit").hide();

    client = matrixcs.createClient({
        baseUrl: BASE_URL,
        //accessToken: TOKEN,
        //userId: USER_ID
    });

    PASSWD = "Bernapark-ZID-TFAG";
    console.log("Password is: " + PASSWD);
    console.log("--> initClient done.");

}

function registerClicked() {
    username = $('#username').val();
    console.log("UserName: " + username);
    setResult(username);

    client.register(username, PASSWD, SESSION, {}, false, {}, false, registerNoAuth());

}

function submitClicked() {
    setResult("Submit clicked");
    client.register(username, PASSWD, SESSION, {}, false, false, false, registerCallback());
}

function setResult(result) {
    document.getElementById("result").innerHTML = "<p>Result: " + result + "</p>";
}

function registerNoAuth(response) {
    console.log("register NoAuth response: " +response);
}


function registerResponse(response) {
    console.log("register response: " +response);
}

function reCaptchaFullfilled(response) {
    console.log("reCaptcha response: " +response);
    $("#submit").show();

    var auth = {"type": "m.login.recaptcha",
                        "response": response,
                        "session": SESSION };

    client.register(username, PASSWD, SESSION, auth, false, {}, false, registerCallback());

}

function registerCallback(response) {
    console.log("register Callback: " +response);
}

