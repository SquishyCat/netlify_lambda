//Create a gamesparks object to be used
var gamesparks = new GameSparks();
window.gamesparks = gamesparks;
let targetURL = LAMBDA_ENDPOINT + "hash?nonce=";


//Initialse the SDK
function init() {
    gamesparks.initPreview({
        key: document.getElementById('apiKey').value,
        credential: document.getElementById('apiCredential').value,
        onNonce: onNonce,
        onInit: onInit,
        onMessage: onMessage,
        logger: console.log,
    });

}

//Callback function to hmac sha256 a nonce with the secret. It's assumed you will have your own method of securing the secret;
function onNonce(nonce) {
    return getHMAC(nonce);
}

function getHMAC(nonce) {
    let xhttp = new XMLHttpRequest();
    let hashElement = document.getElementById("hashURL");
    let url = targetURL + nonce;
    let retVal = "";
    hashElement.value = url;

    // This is blocking, and must be, as the onNonce call is not async.
    xhttp.open("GET", url, false);
    xhttp.send();

    if (xhttp.status === 200) {
        let hashObject = JSON.parse(xhttp.responseText);
        document.getElementById("secretHash").value = hashObject.hash;
        onMessage(hashObject);
        return hashObject.hash;
    }
}

function registrationRequest() {
    gamesparks.registrationRequest("testuser", "testuser", "testuser", registerResponse);
};

function loginRequest() {
    gamesparks.authenticationRequest("testuser", "testuser", loginResponse);
};

function accountRequest() {
    gamesparks.accountDetailsRequest(accountDetailsResponse);
};

//Callback to handle when the SDK is initialised and ready to go
function onInit() {
    console.log("Initialised");
}

//Callback to handle async messages from the gamesparks platform
function onMessage(message) {
    console.log("onMessage");
    let currVal = document.getElementById("userInfo").value;
    currVal = JSON.stringify(message) + "\n\n" + currVal;
    document.getElementById("userInfo").value = currVal;

}

//Response handler examples
function registerResponse(response) {
    console.log(JSON.stringify(response));
}

function loginResponse(response) {
    console.log(JSON.stringify(response));
}

function accountDetailsResponse(response) {
    console.log(JSON.stringify(response));
}

function customEvent() {
    gamesparks.sendWithData(
        "LogEventRequest",
        {
            eventKey: "FIRST_EVENT",
            NUMBER_ATTR: 123,
            STRING_ATTR: "this is a string",
            JSON_ATTR: { key1: 12, key2: "abc" }
        },
        function (response) { console.log(JSON.stringify(response)); }
    );
}

var myTimer = null;
var myRTSession = function () { };
var numCycles = 0;

myRTSession.started = false;
myRTSession.onPlayerConnectCB = null;
myRTSession.onPlayerDisconnectCB = null;
myRTSession.onReadyCB = null;
myRTSession.onPacketCB = null;
myRTSession.session = null;

myRTSession.start = function (connectToken, host, port) {
    var index = host.indexOf(":");
    var theHost;

    if (index > 0) {
        theHost = host.slice(0, index);
    } else {
        theHost = host;
    }

    console.log(theHost + " : " + port);

    myRTSession.session = GameSparksRT.getSession(connectToken, theHost, port, myRTSession);
    if (myRTSession.session != null) {
        myRTSession.started = true;

        myRTSession.session.start();
    } else {
        myRTSession.started = false;
    }
};

myRTSession.stop = function () {
    myRTSession.started = false;

    if (myRTSession.session != null) {
        myRTSession.session.stop();
    }
};

myRTSession.log = function (message) {
    var peers = "|";

    for (var k in myRTSession.session.activePeers) {
        peers = peers + myRTSession.session.activePeers[k] + "|";
    }

    console.log(myRTSession.session.peerId + ": " + message + " peers:" + peers);
};

myRTSession.onPlayerConnect = function (peerId) {
    myRTSession.log(" OnPlayerConnect:" + peerId);

    if (myRTSession.onPlayerConnectCB != null) {
        myRTSession.onPlayerConnectCB(peerId);
    }
};

myRTSession.onPlayerDisconnect = function (peerId) {
    myRTSession.log(" OnPlayerDisconnect:" + peerId);

    if (myRTSession.onPlayerDisconnectCB != null) {
        myRTSession.onPlayerDisconnectCB(peerId);
    }
};

myRTSession.onReady = function (ready) {
    myRTSession.log(" OnReady:" + ready.toString());

    if (myRTSession.onReadyCB != null) {
        myRTSession.onReadyCB(ready);
    }
};

myRTSession.onPacket = function (packet) {
    myRTSession.log(" OnPacket:" + packet.toString());

    if (myRTSession.onPacketCB != null) {
        myRTSession.onPacketCB(packet);
    }
};

function testRT() {
    myRTSession.stop();

    gamesparks.initPreview({
        key: document.getElementById('apiKey').value, //apiKey,
        // secret: apiSecret,
        credential: "",
        onNonce: onNonceRT,
        onInit: onInitRT,
        onMessage: onMessageRT,
        logger: console.log,
    });
}

function onNonceRT(nonce) {
    // return CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(nonce, apiSecret));
    return getHMAC(nonce);
}

function onInitRT() {
    console.log("Initialised");

    gamesparks.deviceAuthenticationRequest((Math.floor(Math.random() * (999 - 1)) + 1).toString(), null, null, "js", null, null, function (response) {
        if (response.error) {
            console.error(JSON.stringify(response.error));
        } else {
            sendMatchmakingRequest();
        }
    });
}

//Callback to handle async messages from the gamesparks platform
function onMessageRT(message) {
    //console.log("message " + JSON.stringify(message));
    if (message["@class"] === ".MatchFoundMessage") {
        var accessToken = message["accessToken"];
        var host = message["host"];
        var port = message["port"];

        myRTSession.stop();

        if (myTimer) {
            clearTimeout(myTimer);
        }

        myTimer = setInterval(mainRTLoop, 10);

        myRTSession.start(accessToken, host, port);
    } else if (message["@class"] === ".MatchNotFoundMessage") {
        console.log("MATCH NOT FOUND");

        sendMatchmakingRequest();
    }
}

function sendMatchmakingRequest() {
    gamesparks.sendWithData("MatchmakingRequest",
        {
            skill: 1,
            matchShortCode: "Match_STD"
        },
        function (response) {
            if (response.error) {
                console.error(JSON.stringify(response.error));
            } else {
                console.log("Match OK...");
            }
        }
    );
}

function mainRTLoop() {
    if (myRTSession.started) {
        myRTSession.session.update();

        var data = RTData.get();

        data.setLong(1, numCycles);

        myRTSession.session.sendRTData(1, GameSparksRT.deliveryIntent.RELIABLE, data, []);

        numCycles++;
    }
}

document.getElementById('init').onclick = init;
document.getElementById('test-rt').onclick = testRT;
document.getElementById('register').onclick = registrationRequest;
document.getElementById('login').onclick = loginRequest;
document.getElementById('account').onclick = accountRequest;
document.getElementById('custom').onclick = customEvent;