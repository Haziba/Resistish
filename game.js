module.exports = function(){
	var players = [];
	var state = GameState.WaitingForPlayers;

	sub("socket join", function(id, data){
		players.push(id);
		console.log("Game - " + id + " connected. Currently have: " + players.length + " players.")
		
		if(players.length >= 5){
			gameStart();
		}
	});
	
	var gameStart = function(){
		state = GameState.Start;
		console.log("Game - Start game!");

		distributeRoles();
	}

	var distributeRoles = function(){
		var playerPool = players.slice();
		var totalSpies = [0,0,1,2,2,2,3,4];
		var spies = [];

		for(var i = 0; i < totalSpies[players.length]; i++){
			console.log(i, totalSpies[players.length]);
			var index = Math.floor(Math.random() * playerPool.length);
			spies.push(playerPool[index]);
			playerPool.splice(index, 1);
		}

		for(var i = 0; i < players.length; i++){
			if(spies.indexOf(players[i]) >= 0){
				pub('socket message send ' + players[i], { type: MessageType.InitialMessage, team: Teams.Spy } );
			} else {
				pub('socket message send ' + players[i], { type: MessageType.InitialMessage, team: Teams.Resistance } );
			}
		}
	}
};

var GameState = {
	WaitingForPlayers: 1,
	Start: 2,
};
