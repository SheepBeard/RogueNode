const WebSocket = require("ws");

const server = new WebSocket.Server({port:5432})

console.log('Listening on Port: ' + 5432);

server.on('connection', function connection(ws) {

	ws.on('message', function(message) {

		console.log('Message: ' + message);
		ws.send(JSON.stringify({ msg: "Echo: "+message, id: 1 }));
		server.clients.forEach((client) => {
  			client.send(JSON.stringify({ msg: "Universal Message", id: 1 }));
		});

	});
	
	ws.on('close', () => {
  		console.log('Someone Has Left');
	});

	console.log('New Client Connected!');
	ws.send(JSON.stringify({ msg: "Welcome Client", id: 1 }));

});

