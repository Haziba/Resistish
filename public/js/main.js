var startPlayer = function(id, $div){
	var socket = io.connect('http://localhost:4200?id=' + id, {'force new connection': true});

	var team;

	socket.on('connect', function(data) {
		socket.emit('join');
	});
	socket.on('message', function(data) {
		console.log(id, data);
		switch(data.type){
			case MessageType.InitialMessage:
				team = data.team;

				$div.append($("<div/>").text(team == Teams.Resistance ? "Resistance" : "Spy!").addClass(team).addClass("team"));

				if(data.teamLeader){
					$div.append($("<div/>").text("Team Leader").addClass("team-leader"));
				}
				break;
		}
	});
}
