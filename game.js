module.exports = function(){
	var players = [];
	var state = GameState.WaitingForPlayers;
	var teamLeader;
	var level = 0;
	
	var spies;

	sub("socket join", function(id, data){
		players.push(id);
		console.log("Game - " + id + " connected. Currently have: " + players.length + " players.")

		sub("socket message get " + id, function(data){
			console.log("Heyyy dawg", id, data);
		});
		
		if(players.length >= 5){
			gameStart();
		}
	});
	
	var gameStart = function(){
		state = GameState.Start;
		console.log("Game - Start game!");

		distributeRoles();

		levelRun();
	}

	var levelRun = function(){
		leadTeam();
	}

	var distributeRoles = function(){
		var playerPool = players.slice();
		var totalSpies = [0,0,1,2,2,2,3,4];
		spies = [];

		for(var i = 0; i < totalSpies[players.length]; i++){
			console.log(i, totalSpies[players.length]);
			var index = Math.floor(Math.random() * playerPool.length);
			spies.push(playerPool[index]);
			playerPool.splice(index, 1);
		}

		teamLeader = Math.floor(Math.random() * players.length);

		for(var i = 0; i < players.length; i++){
			var team = spies.indexOf(players[i]) >= 0 ? Teams.Spy : Teams.Resistance;

			pub('socket message send ' + players[i], {
				type: MessageType.InitialMessage, 
				team: team,
				teamLeader: i == teamLeader,
			} );
		}
	}

	var leadTeam = function(){
		var playersPerMission = [2,3,2,3,4];

		for(var i = 0; i < players.length; i++){
			pub('socket message send ' + players[i], {
				type: i == teamLeader ? MessageType.LeadTheTeam : MessageType.AwaitLeadership,
				players: players,
				playersPerMission: playersPerMission[level],
			});
		}
	}
};

var GameState = {
	WaitingForPlayers: 1,
	Start: 2,
};
