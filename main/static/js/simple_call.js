"use strict";
console.log("VoIP-Test loading...");

var BASE_URL = "https://matrix.org";

// Room "talent-factory":
var ROOM_ID = "!IDTxyVLBWnjXswzvrA:matrix.org";
var TOKEN;
var USER_ID;
var PASSWD;

var client;
var call;

function disableButtons(place, answer, hangup) {
    document.getElementById("call-audio").disabled = place;
    document.getElementById("answer").disabled = answer;
    document.getElementById("hangup").disabled = hangup;
}

function addListeners(call) {
    var lastError = "";
    call.on("hangup", function() {
        disableButtons(false, true, true);
        document.getElementById("result").innerHTML = (
            "<p>Call ended. Last error: "+lastError+"</p>"
        );
    });
    call.on("error", function(err) {
        lastError = err.message;
        call.hangup();
        disableButtons(false, true, true);
    });
}

//window.onloadend = function() {
$(document).ready(function () {
    console.log("Document ready...");
    disableButtons(true, true, true);
    document.getElementById("tf001").onclick = function() {
        initClient("@tf001:matrix.org");
    };
    document.getElementById("tf002").onclick = function() {
        initClient("@tf002:matrix.org");
    };
    document.getElementById("tf003").onclick = function() {
        initClient("@tf003:matrix.org");
    };
});


function initClient(user) {
    USER_ID = user;
    console.log("Selected user: " + USER_ID);

    client = matrixcs.createClient({ baseUrl: BASE_URL, });

    PASSWD = "Berna-" + USER_ID.substr(1,5);
    console.log(PASSWD);
    client.login("m.login.password", {"user": USER_ID, "password": PASSWD})
        .then((response) => {
            TOKEN = response.access_token;
            console.log(response.access_token);
            showConfig();

            client.startClient();
        });

    document.getElementById("result").innerHTML = "<p>Please wait. Syncing...</p>";
    showConfig();

    client.on("sync", function(state, prevState, data) {
        switch (state) {
            case "PREPARED":
                syncComplete();
                break;
        }
    });
}

function syncComplete() {
    document.getElementById("result").innerHTML = "<p>Ready for calls.</p>";
    disableButtons(false, true, true);

    document.getElementById("call-audio").onclick = function() {
        console.log("Placing audio call...");
        call = matrixcs.createNewMatrixCall(client, ROOM_ID);
        console.log("Call => %s", call);
        addListeners(call);
        call.placeVoiceCall();
        document.getElementById("result").innerHTML = "<p>Placed voice call.</p>";
        disableButtons(true, true, false);
    };

    document.getElementById("hangup").onclick = function() {
        console.log("Hanging up call...");
        console.log("Call => %s", call);
        call.hangup();
        document.getElementById("result").innerHTML = "<p>Hungup call.</p>";
    };

    document.getElementById("answer").onclick = function() {
        console.log("Answering call...");
        console.log("Call => %s", call);
        call.answer();
        disableButtons(true, true, false);
        document.getElementById("result").innerHTML = "<p>Answered call.</p>";
    };

    client.on("Call.incoming", function(c) {
        console.log("Call ringing");
        disableButtons(true, false, false);
        document.getElementById("result").innerHTML = "<p>Incoming call...</p>";
        call = c;
        addListeners(call);
    });
}

function showConfig() {
    document.getElementById("config").innerHTML = "<p>" +
        "Homeserver: <code>"+BASE_URL+"</code><br/>"+
        "Room: <code>"+ROOM_ID+"</code><br/>"+
        "User: <code>"+USER_ID+"</code><br/>"+
        "AccessToken: <code>"+TOKEN+"</code><br/>"+
        "</p>";
}
