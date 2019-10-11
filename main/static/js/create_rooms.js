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

var fromNum;
var toNum;
var pattern;
var param1 = "{%1}";
var text = "(init)";


// window.onloadend = function() {
$(document).ready(function () {
    $("#tf001").click(() => initClient("@tf001:matrix.org"));
    $("#createRooms").hide();
    $("#createRooms").click(() => createRoomsWithPromises());

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
    $("#createRooms").show();
    logRoomsToConsole();
}

//----------------
//  Create Rooms
//----------------
function readInputs() {
    fromNum = $("#fromNum").val();
    toNum = $("#toNum").val();
    pattern = $("#pattern").val();
}

function createRoomsWithPromises() {
    text = "Creating Rooms:<br>";
    setResult(text);

    readInputs();


    const ids = [];
    for (var id = fromNum; id <= toNum; id++) {
        ids.push(parseInt(id));
    }
    console.log(ids);

    const funcs = ids.map(id => () => createRoom(id));
    // execute Promises in serial
    promiseSerial(funcs)
        .then((resultArray) => creationFinished(resultArray))
        .catch(console.error.bind(console));
}

// Execute the list of promises in serial, accumulate result in an array
const promiseSerial = funcs =>
    funcs.reduce((promise, func) =>
            promise.then(result =>
                func().then(Array.prototype.concat.bind(result))),
        Promise.resolve([]));


// This promise resolves the Room Name
const createRoom = id =>
    new Promise((resolve) => {
        let chan = (id < 10 ? "0" : "") + id;
        let roomName = pattern.replace(param1, chan);
        text += roomName;
        setResult(text);

        client.createRoom({"room_alias_name" : roomName})
            .then((response) => {
                setResult(text += (" ...done. ID = " + response.room_id + "<br>"));
                resolve(response);
            })
            .catch((response) => {
                console.log("Create room failed, reason: " + response);
                setResult(text += (" ...failed. error = " + response + "<br>"));
                resolve(response);
            });
    });

function creationFinished (res) {
    console.log(res);
    $("#conclusion").html("--> Creation finished.<br>");
}

function wait(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function setResult(aText) {
    $("#result").html(aText);
}

function appendResult(aText) {
    setResult($("#result").html() + aText);
}

function logRoomsToConsole() {
    console.log("  Existing rooms:");
    var rooms = client.getRooms();
    wait(1000).then(() => {
        rooms.forEach(room => {
            console.log("  -> Room: " + room.roomsData + " / " + room.roomId);
            //console.log("  -> Room: " + room.toString());
        });
    });
}


