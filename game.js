module.exports = function(){
	var players = [];
	var state = GameState.WaitingForPlayers;

	sub("socket join", function(id, data){
		console.log("Holla")
		players.push(id);
		console.log(id, " connected. Currently have:", players.length, " players.")
		
		if(players.length >= 2){
			gameStart();
		}
	});
	
	var gameStart = function(){
		state = GameState.Start;
		console.log("Start game!");

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
			pub('socket message send ' + playerPool[index], 'spy');
			playerPool.splice(index, 1);
		}

		console.log(spies);
	}
};

var GameState = {
	WaitingForPlayers: 1,
	Start: 2,
};
