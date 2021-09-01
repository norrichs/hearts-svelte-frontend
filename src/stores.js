import { writable, readable, derived } from "svelte/store";
// import {url} from './pages/Game.svelte'
// import { newGameState } from './gameStates.js'

let gameIdLocal;
const localUrl = 'http://localhost:4500'
const deployedUrl = "https://hearts-backend.herokuapp.com";

export const url = localUrl;
const user = 0;

// export const time = readable(null, (set) => {
// 	set(new Date());

// 	const interval = setInterval(() => {
// 		set(new Date());
// 	}, 1000);

// 	return () => clearInterval(interval);
// });



let delay = 5000;


const createGameState = () => {
	const { subscribe, set, update } = writable(null, async (set)=>{
		set(await startNewGame())
		
		const interval = setInterval( async () => {
			set( await pollGameState(gameIdLocal))
		}, 1000)

		return ()=>clearInterval(interval)
	})


	return {
		subscribe,
		update,
		set,
		syncState: (newGS)=>set(newGS)
		// selectCard: (user, cardId) => update( async (gS)=>{
		// 	console.log('gS.selectCard', gameIdLocal, user, cardId)
		// 	const resp = await fetch(
		// 		`${url}/gameState/selectCard/${gameIdLocal}/${user}/${cardId}`
		// 	);
		// 	const data = await resp.json();
		// 	return data.data;
		// })
		// pass
		// play
	}
}

export const gS = createGameState()


// export const gS = writable(null, async (set) => {
// 	set(await startNewGame());

// 	const interval = setInterval(async () => {
// 		set(await pollGameState(gameIdLocal));
// 	}, 5000);

// 	return () => clearInterval(interval);
// });











// WORKING WRITABLE STORE

// export const gS = writable(null, async (set) => {
// 	set(await startNewGame());

// 	const interval = setInterval(async () => {
// 		set(await pollGameState(gameIdLocal));
// 	}, 5000);

// 	return () => clearInterval(interval);
// });





// const createGS = () => {
// 	const {subscribe, set, update} = writable(null, async (set)=>{
// 		const newGame = await startNewGame()
// 		gameIdLocal = newGame._id
// 		set(newGame)
// 		console.log('*** ',gameIdLocal)
// 	})
	
// 	const interval = setInterval(async () => {
// 		console.log('interval')
// 		console.log(gameIdLocal)
// 		set(await pollGameState(gameIdLocal))
// 	}, 10000)
	
// 	return {
// 		subscribe,
// 		unsubscribe: () => clearInterval(interval)
// 	}
	
// }

// export const gS = createGS();





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
	const resp = await fetch(`${url}/gameState/seed`);
	const data = await resp.json();
	console.log(" - got new game", data.data);
	return data.data;
};

const fetchDealtHand = async () => {
	console.log(" dealing hand");
	const resp = await fetch(`${url}/gameState/deal/${gameIdLocal}`);
	const data = await resp.json();
	console.log(" - newly dealt hand gamedata", data.data);
	return data.data;
};

const pollGameState = async () => {
	// console.log(' refreshing game state')
	const resp = await fetch(`${url}/gameState/getState/${gameIdLocal}/${user}`);
	const data = await resp.json();
	const result = { ...data.data };
	console.log(" gS", result);
	return result;
};
