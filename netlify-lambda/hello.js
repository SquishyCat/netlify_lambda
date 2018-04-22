const hdrs = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type"
};

exports.handler = function(event, context, callback) {
    callback(null, {
        statusCode: 200,
        headers: hdrs,
        body: "Hello, World"
    });
}