"use strict";
console.log("Simple Test loading...");

//window.onloadend = function() {
$(document).ready(function () {
    console.log("Document ready...");
    wait(5000).then(() => {
        console.log('5 seconds have passed...')
    });

    $("#button001").click( function () {
        setResult("Click!<br>");
        createRoomsWithPromises();
    });

});

var fromnum = 1;
var toNum = 12;
var param1 = "{%1}";
var pattern = "RSS-TEST-CH" + param1;
var text = "(init)";

function createRoomsWithPromises() {
    text = "Creating Rooms:<br>";
    setResult(text);

    const ids = [];
    for (var id = fromnum; id <= toNum; id++) {
        ids.push(id);
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

        wait(500).then(() => {
            setResult(text += " ...done.<br>");
            resolve(roomName);
        });

        // ...client.createRoom().then().catch()....
        // return the roomName to the caller
        //resolve(roomName);
    });

function creationFinished (res) {
    console.log(res);
    appendResult("--> Creation finished.");
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
