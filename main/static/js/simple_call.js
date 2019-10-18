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

//window.onloadend = function() {
$(document).ready(function () {
    console.log("Document ready...");
    disableButtons(true, true, true);

    $("#roomselector").change(function() {
        $("#selval").html( $(this).children(":selected").val())});

    $("#tf001").click(() => initClient("@tf001:matrix.org"));
    $("#tf002").click(() => initClient("@tf002:matrix.org"));
    $("#tf003").click(() => initClient("@tf003:matrix.org"));
    $("#stefangraf").click(() => initClient("@stefangraf:matrix.org"));
    $("#tf004").click(() => initAndRegisterGuest("@tf004g:matrix.org"));

    initPTT();
});


function initClient(user) {
    USER_ID = user;
    console.log("Selected user: " + USER_ID);

    client = matrixcs.createClient({ baseUrl: BASE_URL, });
    if (user.startsWith("@stefangraf")){
        PASSWD = "Bernapark-ZID-TFAG";
    } else {
        PASSWD = "Berna-" + USER_ID.substr(1,5);
    }
    console.log(PASSWD);
    client.login("m.login.password", {"user": USER_ID, "password": PASSWD})
        .then((response) => {
            TOKEN = response.access_token;
            console.log(response.access_token);
            showConfig();

            client.startClient();
        })
        .catch((err) => displayError(err));

    $("#result").html(" <p>Please wait. Syncing...</p>");
    showConfig();

    client.on("sync", function(state, prevState, data) {
        switch (state) {
            case "PREPARED":
                syncComplete();
                break;
        }
    });
}


function initAndRegisterGuest(user) {
    USER_ID = user;
    console.log("Selected user: " + USER_ID);

    client = matrixcs.createClient({ "baseUrl": BASE_URL, });

    PASSWD = "Berna-" + USER_ID.substr(1,5);
    console.log(PASSWD);
    client.registerGuest({body: {"user": USER_ID, "password": PASSWD}}, loginCallback)
        .then((response) => {
            console.log("registerGuest done...");
            TOKEN = response.access_token;
            console.log(response.access_token);
            showConfig();

            client.startClient();
        })
        .catch((err) => displayError(err));

    $("#result").html(" <p>Please wait. Syncing...</p>");
    showConfig();

    client.on("sync", function(state, prevState, data) {
        switch (state) {
            case "PREPARED":
                syncComplete();
                break;
        }
    });
}

function loginCallback(err, data) {
    console.log("...loginCallback() called...");
    if (err) throw err;
    console.log(data);
}

function displayError(err) {
    let txt = JSON.stringify(err);
    console.log(txt);
    alert(txt)
}

function syncComplete() {
    $("#result").html(" <p>Ready for calls.</p>");
    disableButtons(false, true, true);
    
    $("#call-audio").click(() => {
        console.log("Placing audio call...");
        call = matrixcs.createNewMatrixCall(client, ROOM_ID);
        console.log("Call => %s", call);
        addListeners(call);
        call.placeVoiceCall();
        $("#result").html(" <p>Placed voice call.</p>");
        disableButtons(true, true, false); 
    });

    $("#hangup").click(() => {
        console.log("Hanging up call...");
        console.log("Call => %s", call);
        call.hangup();
        $("#result").html(" <p>Hungup call.</p>");
    });

    $("#answer").click(() =>  {
        console.log("Answering call...");
        console.log("Call => %s", call);
        call.answer();
        disableButtons(true, true, false);
        $("#result").html(" <p>Answered call.</p>");
    });

    client.on("Call.incoming", function(c) {
        console.log("Call ringing");
        disableButtons(true, false, false);
        $("#result").html(" <p>Incoming call...</p>");
        call = c;
        addListeners(call);  
    });
}

function addListeners(call) {
    var lastError = "";
    call.on("hangup", function() {
        disableButtons(false, true, true);
        $("#result").html("<p>Call ended. Last error: "+lastError+"</p>");
    });
    call.on("error", function(err) {
        lastError = err.message;
        call.hangup();
        disableButtons(false, true, true);
    });
}

function disableButtons(place, answer, hangup) {
    $("#call-audio").prop("disabled",  place);
    $("#answer").prop("disabled",  answer);
    $("#hangup").prop("disabled",  hangup);
}

function showConfig() {
    $("#config").html(" <p>" +
        "Homeserver: <code>"+BASE_URL+"</code><br/>"+
        "Room: <code>"+ROOM_ID+"</code><br/>"+
        "User: <code>"+USER_ID+"</code><br/>"+
        "AccessToken: <code>"+TOKEN+"</code><br/>"+
        "</p>");
}

let stream;
let gUM = c => navigator.mediaDevices.getUserMedia(c);

function initPTT() {
    $("#ptt").mousedown(() => pttMouse(true));
    $("#ptt").mouseup(() => pttMouse(false));
    $("#ptt").mouseleave((e) => pttMouseleave(e));
    $("#mic").click(() => micClick());

    console.log(("PTT & Microphone initialized"))
}

(async () => {
    stream = await gUM({audio: true});
    if (stream) {
        setMicState(false);
        console.log("-------> Got userMedia successfully")
    }
})().catch(err => errorCallback(err));

function  errorCallback(err) {
    console.log("x x x --> Error getting userMedia!\n" + err)
}

function pttMouse(talk) {
    console.log("PTT mouse event, talk = " + talk.toString());
    setMicState(talk)
}

function pttMouseleave(event) {
    console.log("PTT mouseleave event");
    let key = event.buttons;
    if (key && key === 1) {
        setMicState(false)
    }
}

function micClick() {
    setMicState($("#mic").prop("checked"))
}

function setMicState(on) {
    $("#mic").prop("checked", on);
    stream.getAudioTracks().forEach(function(track) {
        track.enabled = on;
    }, on);
    console.log("microphone is " + (on ? "enabled ********" : "******* disabled"))
}
