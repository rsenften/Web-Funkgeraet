"use strict";
console.log("Loading script: creatingRooms.js...");

var BASE_URL = "https://matrix.org";

// accessToken of tf001:
var TOKEN = "MDAxOGxvY2F0aW9uIG1hdHJpeC5vcmcKMDAxM2lkZW50aWZpZXIga2V5CjAwMTBjaWQgZ2VuID0gMQowMDI0Y2lkIHVzZXJfaWQgPSBAdGYwMDE6bWF0cml4Lm9yZwowMDE2Y2lkIHR5cGUgPSBhY2Nlc3MKMDAyMWNpZCBub25jZSA9IE1rZEVjZ1NIaXJ6M2lCXksKMDAyZnNpZ25hdHVyZSAS7IR5qcvcqswWFAEq0feE8A7qD3UueE_1Q1HdJ_CFDgo";

// Room "talent-factory":
var ROOM_ID = "!IDTxyVLBWnjXswzvrA:matrix.org";

var USER_ID;
var PASSWD;
var client;
var roomName;
var text = "(init)";
var roomList = {};

// window.onloadend = function() {
$(document).ready(function () {
    $("#tf001").click(() => initClient("@tf001:matrix.org"));
    $("#createRoom").click(() => createSingleRoom());

    console.log("Document ready...");
});

//----------------
//  Init and Login
//----------------
function initClient(userid) {
    USER_ID = userid;
    PASSWD = "Berna-" + USER_ID.substr(1, 5);
    console.log("User / PW: " + USER_ID + " / " + PASSWD);
    setResult("<p>Please wait. Syncing...</p>");

    client = matrixcs.createClient({
        baseUrl: BASE_URL,
    });

    client.login("m.login.password", {"user": USER_ID, "password": PASSWD})
        .then((response) => {
            TOKEN = response.access_token;
            console.log("Received Accesss Token: " + TOKEN);

            $("#config").html("<p>" +
                "Homeserver: <code>"+BASE_URL+"</code><br/>"+
                "Room: <code>"+ROOM_ID+"</code><br/>"+
                "User: <code>"+USER_ID+"</code><br/>"+
                "AccessToken: <code>"+TOKEN+"</code><br/>"+
                "</p>");

            client.startClient();
        })
        .catch((response) => {
            $("#config").html("LOGIN FAILED");
            console.log("Login failed, reason: " + response);
        });

    // after startClient, wait until sync complete
    client.on("sync", function(state, prevState, data) {
        switch (state) {
            case "PREPARED":
                syncComplete();
                break;
        }
    });
}

function syncComplete() {
    setResult("<p>Client login & start completed...</p>");
    $("#createRoom").show();
    logRoomsToConsole();
}

//------------------------------
//  Create a singler room
// -----------------------------
function createSingleRoom() {
    if (client) {
        roomName = $("#room-name").val();
        setResult(roomName);

        client.createRoom({"room_alias_name": roomName})
            .then((response) => {
                let roomId = response.room_id;
                appendResult(" ...done. Id = " + roomId + "<br>");
                creationSuccess(roomName, roomId);
            })
            .catch((response) => {
                console.log("Create room failed, reason: " + response);
                appendResult(" ...failed. error = " + response + "<br>");
                creationFailed(response);
            });
    } else {
        setResult("Please login again")
    }
}

function creationSuccess (name, id) {
    console.log("Name: " + name + ": Id: " + id);
    $("#room-name").val(name);  // ist schon dort
    $("#room-id").val(id);
}

function creationFailed(res) {
    console.log(res);
}

function wait(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function setResult(aText, ) {
    $("#result").html(aText);
}

function appendResult(aText) {
    setResult($("#result").html() + aText);
}

function logRoomsToConsole() {
    console.log("  Existing rooms in matrix.org:");
    var rooms = client.getRooms();
    wait(1000).then(() => {
        rooms.forEach(room => {
            console.log("  -> Room: " + room.room + " / " + room.roomId);
        });
    });
}

/*
    Name: RSSIM-TEST-CH29: Id: !shrRFGfsBtKmQzIAxh:matrix.org
 */
