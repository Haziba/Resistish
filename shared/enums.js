var parent = typeof(global) != "undefined" ? global : window;

parent.MessageType = {
	InitialMessage: 1,

	LeadTheTeam: 2,
	AwaitLeadership: 3,
};

parent.Teams = {
	Spy: "spy",
	Resistance: "resistance",
};
