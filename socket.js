module.exports = function(server){
	var io = require('socket.io')(server);

	var totalClients = 0;
	var clients = {};

	io.on('connection', function(client) {
		var id = totalClients++;
		clients[id] = client;

		console.log('Socket - Client ' + id + ' connected...');

		client.on('message', function(data) {
			pub('socket message get ' + id, data);
			console.log('Socket - message', id, data);
		});

		sub("socket message send " + id, function(data){
			client.emit("message", data);
			console.log('Socket - socket message send', id, data);
		});

		pub('socket join', id); 
	});
}
