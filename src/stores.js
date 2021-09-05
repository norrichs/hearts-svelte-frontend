import { writable, readable, derived } from "svelte/store";

// import {url} from './pages/Game.svelte'
// import { newGameState } from './gameStates.js'

let gameIdLocal;
const localUrl = 'http://localhost:4500'
const deployedUrl = "https://hearts-backend.herokuapp.com";

export const url = localUrl;
// let user = 0;

export const passMap = [
	{ message: "no pass" },
	{ message: "pass across" },
	{ message: "pass right" },
	{ message: "pass left" },
];



export const userParams = writable({
	username: 'dude',
	playerNumber: 0,
	gameId: null,
	winCount: 0,

})

export const user = derived(userParams, $userParams => {
	return $userParams.username;
})

let delay = 10000;
let debug = null // null, 'moonshot'
const createGameState = (delay, debug) => {
	console.log('createGameState', delay)
	const { subscribe, set, update } = writable(null, async (set,tick=delay)=>{
		console.log('set', delay)
		
		
		const interval = setInterval( async () => {
			set( await pollGameState($userParams.gameId))
		}, tick)

		return ()=>clearInterval(interval)
	}, delay, debug)


	return {
		subscribe,
		update,
		set,
		// stop,
		loadGame: async (gameId)=> set(await loadGame(gameId)),
		syncState: (newGS)=>set(newGS),
		pollNow: async () => {set(await pollGameState($userParams.gameId))}
	}
}

export const gS = createGameState(delay, debug)



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


const loadGame = async (gameId) => {
	console.log('loadGame!', gameId)
	const resp = await fetch(`${url}/gameState/getState/${gameId}`);
	const data = await resp.json();
	
	return data.data
}

const startNewGame = async (debug) => {
	let newGame = await fetchNewGame();
	$userParams.gameId = newGame._id;
	if(!debug){
		console.log('no debug state')
		newGame = await fetchDealtHand();
	}else{
		console.log('loading debug file: ',debug)
		newGame = await fetchDebugGame(debug);
	}
	return newGame;
};

const fetchDebugGame = async (debug )=> {
	const resp = await fetch(`${url}/gameState/debug/${$userParams.gameId}/${debug}`);
	const data = await resp.json();
	return data.data
}

const fetchNewGame = async () => {
	console.log(" starting new game");
	const resp = await fetch(`${url}/gameState/seed`);
	const data = await resp.json();
	console.log(" - got new game", data.data);
	return data.data;
};

const fetchDealtHand = async () => {
	console.log(" dealing hand");
	const resp = await fetch(`${url}/gameState/deal/${$userParams.gameId}`);
	const data = await resp.json();
	console.log(" - newly dealt hand gamedata", data.data);
	return data.data;
};

const pollGameState = async () => {
	// console.log(' refreshing game state')
	const resp = await fetch(`${url}/gameState/pollState/${$userParams.gameId}/${user}`);
	const data = await resp.json();
	const result = { ...data.data };
	console.log(" gS", result);
	return result;
};
