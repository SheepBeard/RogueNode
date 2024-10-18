const WebSocket = require("ws");

const server = new WebSocket.Server({port:5432})

console.log('Listening on Port: ' + 5432);

var adminClient;
var IDs = new Map();

//On initial connection, map ID number to the ID Maps - first lets assign the ID Number

server.on('connection', function connection(ws) {

	ws.on('message', function(message) {

		console.log('Message: ' + message);
		if (message == "adminAssign") {
			adminClient = ws
			adminClient.send(JSON.stringify({ msg: "Successfully Connected!", id: 0 }))
			//Send Admin Notification to all clients
			server.clients.forEach((client) => {
				client.send(JSON.stringify({ msg: "adminStart", id: 0 }));
			});
		} else if (String(message).startsWith("ID ")) {
			IDs.set(ws, String(message).slice(3))
			//Check for Admin, send Notif if there is one
			if (adminClient) {
				ws.send(JSON.stringify({ msg: "adminStart", id: 0 }));
			};
		} else if (ws == adminClient || !adminClient) {
			server.clients.forEach((client) => {
				client.send(JSON.stringify({ msg: String(message).slice(2), id: String(message).charAt(0) }));
			});
		} else {
			adminClient.send(JSON.stringify({ msg: String(message).slice(2), id: String(message).charAt(0) }))
		};
	});
	
	ws.on('close', () => {
  		if (ws == adminClient) {
			adminClient = null
			//Send Admin Leave Notif
			server.clients.forEach((client) => {
				client.send(JSON.stringify({ msg: "adminEnd", id: 0 }));
			});
		} else if (adminClient) {
			adminClient.send(JSON.stringify({ msg: IDs.get(ws), id: 7 }))
		};
		IDs.delete(ws)
	});

	console.log('New Client Connected!');
	ws.send(JSON.stringify({ msg: "Welcome Client", id: 0 }));

});

