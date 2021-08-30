import { readable, writable, derived } from "svelte/store";

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
		set(await fetchGameState(gameId));
	}, 500);

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

// export const played = derived(gS, async ($gS) => {
// 	const current = await $gS
// 	console.log('playedCards store', current.firstPlayer, current.playedCards.map(c=>c.id))
// 	let result
// 	if(current.playedCards.length === 0) result = null;
// 	else result = {
// 		first: current.firstPlayer,
// 		cards: [...current.playedCards.map(c=>c.id)]
// 	}
// 	return result
// })

// export const ready = derived(gS, async ($gS) => {
// 	const current = await $gS
// 	console.log('ready store')
// 	let ready = {pass: false, play: false}
// 	if(current.phase === 'pass'){
// 		ready.pass = current.players[user].passes.length === 3 ? true : false;
// 	}else if (current.phase === 'trick'){
// 		ready.play = current.players[user].passes.length === 1 ? true : false;
// 	}
// 	console.log('ready state', ready)
// 	return ready
// })

const startNewGame = async () => {
	let newGame = await fetchNewGame();
	gameIdLocal = newGame._id;
	newGame = await fetchDealtHand();
	return newGame;
};

// const fetchPassCards = async () => {
// 	console.log(" passing cards args")
// 	const resp = await fetch(`${dbUrl}/gameState/passCards/${gameId}`)
// 	const data = await resp.json();
// 	return data.data
// }

// const fetchSelectCard = async (user, cardId) => {
// 	console.log(" selecting card args", gameId, user, cardId)
// 	const resp = await fetch(`${dbUrl}/gameState/selectCard/${gameId}/${user}/${cardId}`)
// 	const data = await resp.json();
// 	// console.log(" - selected card, new gameState", data.data)
// 	return data.data
// }

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

const fetchGameState = async () => {
	// console.log(' refreshing game state')
	const resp = await fetch(`${dbUrl}/gameState/getState/${gameIdLocal}`);
	const data = await resp.json();
	const result = { ...data.data };
	console.log(" gS", data);
	return result;
};
