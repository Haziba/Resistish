module.exports = function(){
	var players = [];
	var teamLeader;
	var playersPerMission = [2,3,2,3,4];
	var level = 0;
	var votes = [];
	var _chosenPlayers;
	var choices;

	var successes = 0;
	var failures = 0;
	
	var spies;

	sub("socket join", function(id, data){
		players.push(id);
		console.log("Game - " + id + " connected. Currently have: " + players.length + " players.")

		sub("socket message get " + id, function(data){
			if(data.type == MessageType.SendTeam){
				sendTeam(data.chosenPlayers);
			}
			if(data.type == MessageType.TeamVoteVote){
				teamVote(data.vote);
			}
			if(data.type == MessageType.MissionChoice){
				missionChoice(data.choice);
			}
		});
		
		if(players.length >= 5){
			gameStart();
		}
	});
	
	var gameStart = function(){
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

		teamLeader = 0;

		for(var i = 0; i < players.length; i++){
			var team = spies.indexOf(players[i]) >= 0 ? Teams.Spy : Teams.Resistance;

			pub('socket message send ' + players[i], {
				type: MessageType.InitialMessage, 
				team: team,
				teamLeader: i == teamLeader,
			} );
		}
	}

	var newLeader = function(){
		// Could potentially all be wrapped up in the LeadTheTeam / AwaitLeadership messages
		pub('socket message send ' + players[teamLeader], {
			type: MessageType.RelinquishCommand,
		});

		teamLeader = (teamLeader + 1) % players.length;

		pub('socket message send ' + players[teamLeader], {
			type: MessageType.AssumeCommand,
		});

		leadTeam();
	}

	var leadTeam = function(){
		for(var i = 0; i < players.length; i++){
			pub('socket message send ' + players[i], {
				type: i == teamLeader ? MessageType.LeadTheTeam : MessageType.AwaitLeadership,
				players: players,
				playersPerMission: playersPerMission[level],
			});
		}
	}

	var sendTeam = function(chosenPlayers){
		_chosenPlayers = chosenPlayers
		for(var i = 0; i < players.length; i++){
			pub('socket message send ' + players[i], {
				type: MessageType.TeamVote,
				chosenPlayers: chosenPlayers,
			});
		}
	}

	var teamVote = function(vote, chosenPlayers){
		if(votes.length == 0){
			votes = [];
		}
		votes.push(vote);
		if(votes.length == players.length){
			var passVotes = votes.filter(function(a) { return a; }).length;
			var passed = passVotes > (votes.length / 2);

			for(var i = 0; i < players.length; i++){
				pub('socket message send ' + players[i], {
					type: MessageType.VoteResult,
					votes: votes,
					pass: passed
				});
			}

			if(passed){
				choices = [];

				setTimeout(function(){
					for(var i = 0; i < players.length; i++){
						pub('socket message send ' + players[i], {
							type: _chosenPlayers.indexOf(players[i]) >= 0 ? MessageType.PlayMission : MessageType.WaitForMission,
							canFail: spies.indexOf(players[i]) >= 0,
						});
					}
				}, 3000);
			} else {
				newLeader();
			}
		}
	}

	var messageChoice = function(choice){
		choices.push(choice);
		if(choices.length >= playersPerMission[level]){
			var success = choices.filter(function(a){ return a; }).length == choices.length;
			if(success)
				successes++;
			else
				failures++;

			for(var i = 0; i < players.length; i++){
				pub('socket message send ' + players[i], {
					type: MessageType.MissionResult,
					success: success
				});
			}

			if(successes >= 3){
				gameEnd({won: true});
			} else if(failures >= 3){
				gameEnd({won: false});
			} else {
				setTimeout(newLeader, 3000);
			}
		}
	}

	var gameEnd = function(result){
		for(var i = 0; i < players.length; i++){
			pub('socket message send ' + players[i], {
				type: MessageType.GameEnd,
				won: result.won
			});
		}
	}
};
