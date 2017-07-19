var startPlayer = function(id, $div){
	var socket = io.connect('http://localhost:4200?id=' + id, {'force new connection': true});

	var team;

	socket.on('connect', function(data) {
		socket.emit('join');
	});
	socket.on('message', function(data) {
		switch(data.type){
			case MessageType.InitialMessage:
				team = data.team;

				$div.append($("<div/>").text(team == Teams.Resistance ? "Resistance" : "Spy!").addClass(team).addClass("team"));

				if(data.teamLeader){
					$div.append($("<div/>").text("Team Leader").addClass("team-leader"));
				}
				break;

			case MessageType.LeadTheTeam:
				var $players = $("<table/>");
				var chosenPlayers = [];

				for(var i = 0; i < data.players.length; i++){
					(function(playerId){
						var $player = $("<tr/>")
							.append($("<td/>").text(data.players[playerId]))
							.append($("<td/>")
								.append($("<button/>").text("Add To Mission").click(function(){
									chosenPlayers.push(playerId);

									$player.find(".add").prop("disabled", true);
									$player.find(".remove").prop("disabled", false);

									$(".sendTeam").prop("disabled", chosenPlayers.length < data.playersPerMission);
								}).addClass("add"))
								.append($("<button/>").text("Remove From Mission").click(function(){
									chosenPlayers.splice(chosenPlayers.indexOf(playerId), 1);

									$player.find(".add").prop("disabled", false);
									$player.find(".remove").prop("disabled", true);


									$(".sendTeam").prop("disabled", chosenPlayers.length < data.playersPerMission);
								}).addClass("remove").prop("disabled", true))
							);
						$players.append($player);
					})(i);
				}

				$div.append($("<div/>").text("Lead the team"));
				$div.append($players);
				$div.append($("<button/>").text("Send Team").addClass("sendTeam").prop("disabled", true).click(function(){
					pub("socket message send", {
						type: MessageType.SendTeam,
						chosenPlayers: chosenPlayers,
					});
				}));
				break;

			case MessageType.AwaitLeadership:
				$div.append($("<div/>").text("Wait for your team to be lead"));
				break;
		}
	});
}
