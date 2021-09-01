import { writable, derived } from "svelte/store";
import { newGameState } from './gameStates.js'

const dbUrl = "http://localhost:4500";
let gameId
const user = 0;

// Custom GameState store with built-in fetch

const createGameState = () => {
	// get the built-in functions from writeable

	//TODO see if there's a better initial value
	const { subscribe, set, update } = writable(newGameState);

	return {
		subscribe,
		newGame: () =>
			update(async (gS) => {
				let newGS = await fetchNewGame();
				console.log('new empty game', newGS);
				gameId = newGS._id
				newGS = await fetchDealtHand(gameId);
				return newGS;
			}),
		dealHand: () => update(async (gS) => await fetchDealtHand(gameId)),
		selectCard: (cardId, user) => update(async (current) => {
			current = await current
			return await fetchSelectCard(current._id, user, cardId)
		}),
		passCards: () => update(async (gS) => await fetchPassCards()),
		playCard: () => update(async (gS) => await fetchPlayCard())
	};
}

export const gS = createGameState();

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
	// console.log(" - selected card, new gameState", data.data)
	return data.data
}

const fetchPassCards = async () => {
	console.log(" passing cards args")
	const resp = await fetch(`${dbUrl}/gameState/passCards/${gameId}`)
	const data = await resp.json();
	return data.data
}

const fetchPlayCard = async () => {
	console.log(" playing card")
	const resp = await fetch(`${dbUrl}/gameState/playCard/${gameId}/${user}`)
	const data = await resp.json();
	return data.data
}


export const userHand = derived(gS, async ($gS) => {
	const current = await $gS
	// console.log('userhand store', current.players[user].hand )
	return [ ...current.players[user].hand ]
});
export const westHand = derived(gS, async ($gS) => {
	const current = await $gS
	// console.log('westhand store', current.players[(user + 1) % 4].hand)
	return [ ...current.players[(user + 1) % 4].hand ]
});
export const northHand = derived(gS, async ($gS) => {
	const current = await $gS
	// console.log('northhand store', current.players[(user + 2) % 4].hand)
	return [ ...current.players[(user + 2) % 4].hand ]
});
export const eastHand = derived(gS, async ($gS) => {
	const current = await $gS
	// console.log('easthand store', current.players[(user + 3) % 4].hand)
	return [ ...current.players[(user + 3) % 4].hand ]
});
export const playedCards = derived(gS, async ($gS) => {
	const current = await $gS
	console.log('playedCards store', current.firstPlayer, current.playedCards.map(c=>c.id))
	return { 
		first: current.firstPlayer,
		cards: [...current.playedCards.map(c=>c.id)]
	}
})
