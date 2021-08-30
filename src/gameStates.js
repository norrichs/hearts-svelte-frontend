export const newGameState = {
	turn: 0,
	phase: "start",
	activePlayer: 0,
	heartsBroken: false,
	handNum: 0,
	trickNum: 0,
	maxScore: 0,
	leader: 0,
	winScore: 100,
	playerOrder: [ 0, 1, 2, 3],
	playedCards: [],
	players: [
		{
			name: "player one",
			playerType: "human",
			position: 0,
			handScore: 0,
			gameScore: 0,
			selectedCard: "",
			hand: [
				{ id: 'c3', selected: false }
			],
			passes: [],
			receivedPass: [],
			tricks: []
		},
		{
			name: "player two",
			playerType: "computer",
			position: 0,
			handScore: 0,
			gameScore: 0,
			selectedCard: "",
			hand: [
				{ id: 'c3', selected: false }
			],
			passes: [],
			receivedPass: [],
			tricks: []
		},
		{
			name: "player three",
			playerType: "computer",
			position: 0,
			handScore: 0,
			gameScore: 0,
			selectedCard: "",
			hand: [
				{ id: 'c3', selected: false }
			],
			passes: [],
			receivedPass: [],
			tricks: []
		},
		{
			name: "player four",
			playerType: "computer",
			position: 0,
			handScore: 0,
			gameScore: 0,
			selectedCard: "",
			hand: [
				{ id: 'c3', selected: false }
			],
			passes: [],
			receivedPass: [],
			tricks: []
		}
	]
}
