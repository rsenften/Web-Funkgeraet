"use strict";
console.log("VoIP-Test loading...");

var BASE_URL = "https://matrix.org";

// Room "talent-factory":
var TF_ROOM_ID = "!IDTxyVLBWnjXswzvrA:matrix.org";
var RSIM_PASSWD = "Bernapark-ZID-TFAG";

var token;
var userId;
var passwd;

var roomId;
var client;
var call;


$(document).ready(function () {
    console.log("Document ready...");
    disableButtons(true, true, true);

    $("#roomselector").change(() => setRoomId($("#roomselector").children(":selected").val()));
    $("#tf-radio-sim").click(() => setRoomId("#tf-radio-sim:matrix.org"));

    $("#tf001").click(() => setUser("@tf001:matrix.org"));
    $("#tf002").click(() => setUser("@tf002:matrix.org"));
    $("#tf003").click(() => setUser("@tf003:matrix.org"));
    $("#stefangraf").click(() => setUser("@stefangraf:matrix.org"));
    $("#takeuser").click(() => setUser("@" + $("#usernameinput").val() + ":matrix.org"));

    //$("#tf004").click(() => initAndRegisterGuest("tf004g"));

    $("#initClient").click(() => initClient(userId));

    initPTT();
});

function setRoomId(room) {
    roomId = room;
    $("#selval").html(roomId);
    console.log("Set room: " + roomId);
}

function setUser(user) {
    userId = user;
    $("#seluser").html(userId);
    console.log("Set user: " + userId);
}

function initClient(user) {
    setResult("Please wait. Creating Client... ");
    client = matrixcs.createClient({ baseUrl: BASE_URL, });

    passwd = RSIM_PASSWD;
    if (user.startsWith("@tf00")){
        passwd = "Berna-" + user.substr(1,5);
    }
    console.log("Password: "+passwd);

    showConfig();
    appendResult("Login... ");
    client.login("m.login.password", {"user": user, "password": passwd})
        .then((response) => {
            token = response.access_token;
            console.log(response.access_token);
            showConfig();

            appendResult("Syncing... ");
            client.startClient();
        })
        .catch((err) => displayError(err));

    client.on("sync", function(state, prevState, data) {
        switch (state) {
            case "PREPARED":
                syncComplete();
                break;
        }
    });
}

function initAndRegisterGuest(user) {
    setUser(user);

    passwd = RSIM_PASSWD;
    console.log("Selected pass: " + passwd);

    setResult("<p>Please wait. Create Client...</p>");
    client = matrixcs.createClient({ "baseUrl": BASE_URL, });

    setResult("<p>Please wait. Register Guest...</p>");
    client.registerGuest(
        {"body": {"user": userId, "password": passwd}},
        (err, data) => loginCallback(err, data))
        .then((response) => {
            console.log("registerGuest done...");
            token = response.access_token;
            console.log(response.access_token);
            showConfig();
            setResult("<p>Please wait. Starting Client...</p>");

            client.startClient();
        })
        .catch((err) => displayError(err));

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
    appendResult("Sync complete. Ready for calls");
    disableButtons(false, true, true);

    $("#call-audio").click(() => {
        console.log("Placing audio call to talent-factory");
        call = matrixcs.createNewMatrixCall(client, TF_ROOM_ID);
        console.log("Call => %s", call);
        addListeners(call);
        call.placeVoiceCall();
        setResult(" <p>Placed voice call to talent-factory.</p>");
        disableButtons(true, true, false);
    });

    $("#call-room").click(() => callIntoSelectedRoom ());

    $("#hangup").click(() => {
        console.log("Hangup call => %s", call);
        call.hangup();
        setResult(" <p>Hungup call.</p>");
    });

    $("#answer").click(() =>  {
        console.log("Answering to call => %s", call);
        call.answer();
        disableButtons(true, true, false);
        setResult("Answering call.");
    });

    client.on("Call.incoming", function(c) {
        setResult("Incoming call...");
        disableButtons(true, false, false);
        call = c;
        addListeners(call);  
    });
}

function callIntoSelectedRoom () {
    setResult("Joining room: " + roomId);
    client.joinRoom(roomId)
        .then(() => placeCall())
        .catch((err) => displayError(err));
}

function placeCall() {
    appendResult(" | Create new matrix call...");
    call = matrixcs.createNewMatrixCall(client, roomId);
    console.log("Call => %s", call);
    addListeners(call);
    call.placeVoiceCall();
    appendResult(" | Placed voice call to: " + roomId);
    disableButtons(true, true, false);
}

function addListeners(call) {
    var lastError = "";
    call.on("hangup", function() {
        disableButtons(false, true, true);
        setResult("<p>Call ended. Last error: "+lastError+"</p>");
    });
    call.on("error", function(err) {
        lastError = err.message;
        call.hangup();
        disableButtons(false, true, true);
    });
}

function disableButtons(place, answer, hangup) {
    $("#call-audio").prop("disabled",  place);
    $("#call-room").prop("disabled",  place);
    $("#answer").prop("disabled",  answer);
    $("#hangup").prop("disabled",  hangup);
}

function showConfig() {
    $("#config").html(" <p>" +
        "Homeserver: <code>"+BASE_URL+"</code><br/>"+
        "Room: <code>"+roomId+"</code><br/>"+
        "User: <code>"+userId+"</code><br/>"+
        "AccessToken: <code>"+token+"</code><br/>"+
        "</p>");
}

function setResult(aText, ) {
    $("#result").html(aText);
    console.log(" s----> " + aText)
}

function appendResult(aText) {
    $("#result").html($("#result").html() + aText);
    console.log(" a----> " + aText)
}

//------------------
// MIC mute
//------------------
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
