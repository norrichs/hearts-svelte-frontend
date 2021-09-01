import { readable, derived } from "svelte/store";

let gameIdLocal;

const dbUrl = "http://localhost:4500";
const user = 0;

export const time = readable(null, (set) => {
	set(new Date());

	const interval = setInterval(() => {
		set(new Date());
	}, 1000);

	return () => clearInterval(interval);
});





export const gS = readable(null, async (set) => {
	set(await startNewGame());

	const interval = setInterval(async () => {
		set(await pollGameState(gameId));
	}, 100);

	return () => clearInterval(interval);
});







export const gameId = derived(gS, $gS => {
	if($gS!==null) return $gS._id
})

export const played = derived(gS, ($gS) => {
	if ($gS !== null) {
		return {
			first: $gS.firstPlayer,
			cards: $gS.playedCards.map(c=>c.id),
		};
	}
});


const startNewGame = async () => {
	let newGame = await fetchNewGame();
	gameIdLocal = newGame._id;
	newGame = await fetchDealtHand();
	return newGame;
};

const fetchNewGame = async () => {
	console.log(" starting new game");
	const resp = await fetch(`${dbUrl}/gameState/seed`);
	const data = await resp.json();
	console.log(" - got new game", data.data);
	return data.data;
};

const fetchDealtHand = async () => {
	console.log(" dealing hand");
	const resp = await fetch(`${dbUrl}/gameState/deal/${gameIdLocal}`);
	const data = await resp.json();
	console.log(" - newly dealt hand gamedata", data.data);
	return data.data;
};

const pollGameState = async () => {
	// console.log(' refreshing game state')
	const resp = await fetch(`${dbUrl}/gameState/getState/${gameIdLocal}`);
	const data = await resp.json();
	const result = { ...data.data };
	console.log(" gS", data.data);
	return result;
};
