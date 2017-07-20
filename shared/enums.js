var parent = typeof(global) != "undefined" ? global : window;

parent.MessageType = {
	InitialMessage: 1,

	LeadTheTeam: 2,
	AwaitLeadership: 3,

	SendTeam: 4,

	TeamVote: 5,
	TeamVoteVote: 6,
	VoteResult: 7,

	PlayMission: 8,
	WaitForMission: 9,

	MissionChoice: 10,

	AssumeCommand: 11,
	RelinquishCommand: 12,
};

parent.Teams = {
	Spy: "spy",
	Resistance: "resistance",
};
