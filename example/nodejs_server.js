var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function (request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(80, function () {
    console.log((new Date()) + ' Server is listening on port 80');
});

var ws = new WebSocketServer({
    httpServer: server,
    maxReceivedFrameSize: 0x10000000,
    autoAcceptConnections: true
});

var sockets = [];
ws.on('connect', function (con) {
    console.log('connect');
    sockets.push(con);
    con.on('message', function (msg) {
        console.log('msg');
        if (msg.type === 'binary') {
            console.log(msg.binaryData.length);
            sockets.forEach(function (dest) {
                dest.sendBytes(msg.binaryData);
            });
        } else {
            sockets.forEach(function (dest) {
                dest.sendUTF(msg.utf8Data);
            });
        }
    })
});