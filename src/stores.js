import { writable, derived } from "svelte/store";
const dbUrl = "http://localhost:4500";
export const gameId = writable("");

const initValue = {
	players: [
		{
			name: "player one",
			playerType: "human",
			hand: [''],
		},
	],
};

// Custom GameState store with built-in fetch

function createGameState() {
	// get the built-in functions from writeable

	//TODO see if there's a better initial value
	const { subscribe, set, update } = writable(initValue);

	// Functions this might need:
	//	new game
	//	deal hand
	//	pass cards
	//
	return {
		subscribe,
		update,
		newGame: () =>
			update(async (gS) => {
				let state = await fetchNewGame();
				console.log(state);
				state = await fetchDealtHand(state._id);
				return state;
			}),
		dealHand: () => update((gS) => fetchDealtHand(gS._id)),
		selectCard: (cardId, user) => update((gS) => fetchSelectCard(gS._id, user, cardId))
	};
}

export const gameState = createGameState();

// const selectCard(id)

const fetchNewGame = async () => {
	console.log(" starting new game");
	const resp = await fetch(`${dbUrl}/gameState/seed`);
	const data = await resp.json();
	console.log(" - got new game", data.data);
	return data.data;
};

const fetchDealtHand = async (gameId) => {
	console.log(" dealing hand");
	const resp = await fetch(`${dbUrl}/gameState/deal/${gameId}`);
	const data = await resp.json();
	console.log(" - newly dealt hand gamedata", data.data);
	return data.data;
};

const fetchSelectCard = async (gameId, user, cardId) => {
	console.log(" selecting card args", gameId, user, cardId)
	const resp = await fetch(`${dbUrl}/gameState/selectCard/${gameId}/${user}/${cardId}`)
	const data = await resp.json();
	console.log(" - selected card, new gameState", data.data)
	return data.data
}

export const userHand = derived(gameState, ($gameState, set) => {
	// console.log('derived store userHand', $gameState.players[0].hand)
	console.log('current gamestate', $gameState)
	set($gameState.players[0].hand);
},['']);
