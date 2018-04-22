const hdrs = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type"
};

exports.handler = function(event, context, callback) {
    let nonce = event.queryStringParameters.nonce;
    let output;
    if (nonce) {
        // output = getJsonOutput("200", "OK", hashWithNonce(nonce));
    } else {
        // output = getJsonOutput("400", "Required querystring property is missing.", "");
    }

    callback(null, {
        statusCode: 200,
        headers: hdrs,
        body: "Hello There"
    });
}

// function hashWithNonce(nonce) {
//     // return crypto.createHmac("SHA256", process.env.API_SECRET).update(nonce).digest("base64");    
//     return "Hash";
// }

// function getJsonOutput(status, message, hash) {
//     return { "status": status, "message": message, "hash": hash };
// }

// function getDebugInfo(nonce, event, context) {
//     return { "apiKey": process.env.API_KEY, "event": event, "context": context };
// }