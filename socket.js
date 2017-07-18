module.exports = function(server){
	var io = require('socket.io')(server);

	var totalClients = 0;
	var clients = {};

	io.on('connection', function(client) {
		var id = totalClients++;
		clients[id] = client;

		console.log('Client ' + id + ' connected...');

		client.on('join', function(data) {
			pub('socket join', id, data); 
			console.log('join', id, data);
		});

		client.on('message', function(data) {
			pub('socket message get ' + id, data);
			console.log('message', id, data);
		});

		sub("socket message send " + id, function(data){
			client.emit("message", data);
			console.log('socket message send', id, data);
		});
	});
}
