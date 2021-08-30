<script>
	import { onDestroy, onMount } from "svelte";
	import { current_component } from "svelte/internal";

	// import PlayDisplay from "../components/PlayDisplay.svelte";
	import HandDisplay from "../components/HandDisplay.svelte";
	import { gameState, userHand } from "../stores.js";

	// props
	// export let dbUrl;
	export let user;

	// Reactive state variables
	// let userHand = $gameState.players[0].hand
	let heartsBroken;
	let gamePhase;
	let passes;
	let currentGameId;

	// Game variables

	// const unsubGameId = gameId.subscribe((id) => {
	// 	console.log('subscribed to gameId')
	// 	currentGameId = gameId;
	// })

	// const unsubGameState = gameState.subscribe((state) => {
	// 	userHand = [...state.players[user].hand];
	// 	heartsBroken = state.heartsBroken;
	// 	gamePhase = state.gamePhase;
	// 	passes = [...state.players[user].passes];
	// });
	// onDestroy(unsubGameState);
	// console.log('broken', heartsBroken)

	// Handles card selection logic, which is different in different phases of the game
	// TODO refactor this logic as backend function followed by store update
	const handleCardClick = async (id) => {
		let currentGameState = await $gameState;
		console.log("clicked, current state", currentGameState, "cardId", id);
		gameState.selectCard(id, user);
	};

	const handleCardClick = async (id) => {
		let currentGameState = await $gameState;
		console.log("clicked, current state", currentGameState, "id", id);

		const i = currentGameState.players[user].hand
			.map((c) => c.id)
			.indexOf(id);
		const card = currentGameState.players[user].hand[i];
		const gamePhase = currentGameState.phase;
		const passes = currentGameState.players[user].passes;
		// let passes = $gameState.players[user].passes
		if (gamePhase === "pass") {
			// Selection of three cards is allowed.
			if (passes.includes(id)) {
				// remove card from passes and set to unselected in hand
				gameState.update((gS) => {
					console.log("already selected", passes, id);
					passes.splice(passes.indexOf(id), 1);
					gS.players[user].passes = [...passes];
					console.log(userHand);
					userHand[i].selected = false;
					return gS;
				});
			} else if (passes.length === 3) {
				gameState.update((gS) => {
					console.log(
						"passes full, adding: " +
							card.id +
							" removing: " +
							passes[0] +
							" from: ",
						passes
					);
					userHand[i].selected = true;
					const deselectIndex = userHand
						.map((c) => c.id)
						.indexOf(passes[0]);
					userHand[deselectIndex].selected = false;
					gS.players[user].passes = [passes[1], passes[2], id];
					return gS;
				});
			} else {
				// Free selection
				gameState.selectCard(id);
				gameState.update((gS) => {
					console.log("adding to passes", passes, id, gS);
					gS.players[user].passes = [...passes, id];
					card.selected = true;
					return gS;
				});
			}
		} else if (gamePhase === "trick") {
			// Selection of one card allowed, must be of led suit, and must follow heartsbroken rules
			console.log("selecting for trick: " + id);
			if (isValidPlaySelection(id)) {
				if (passes.length === 0) {
					console.log("first selection");
					gameState.update((gS) => {
						userHand[i].selected = true;
						gS.players[user].passes = id;
						return gS;
					});
					//set play ready
				} else {
					if (passes[0] === id) {
						console.log("selected second, remove first");
					} else {
						console.log("deselecting");
					}
				}
			}
		} else {
			// Free selection of as many cards as desired
			console.log("unrestricted selection");
			gameState.update((gS) => {
				card.selected = card.selected ? false : true;
				return gS;
			});
		}
	};

	// TODO update for SVELTE

	const isValidPlaySelection = (id) => {
		const ledSuit = gameState.playedCards[0][0];
		console.log(
			"isValid? ",
			card,
			"ledSuit",
			ledSuit,
			gameState.trickNum,
			userHand.includes("c2")
		);

		if (gameState.trickNum === 1 && userHand.includes("c2")) {
			alert("play c2, approved");
			return card === "c2";
		} else if (gameState.playedCards.length === 0) {
			if (gameState.heartsBroken) return true;
			else return card[0] !== "h";
		} else if (userHand.map((c) => c[0]).includes(ledSuit))
			return card[0] === ledSuit;
		else return true;
	};
	////////////////
	// GAME LOOPS //
	////////////////
	const gameLoop = async () => {
		console.log("enter gameLoop");
		await gameState.newGame();
		console.log("gameState at new", $gameState);
		// await gameState.dealHand($gameState._id)
		// console.log('gameState at deal', $gameState)
		// let currentGameState = await startNewGame()
		// setGameId(currentGameState._id)
		// console.log('new game data', currentGameState._id, currentGameState)
		// let maxScore = 0;
		// let winScore = currentGameState.winScore
		// while(maxScore < winScore){
		// 	console.log('start new hand, current maxScore:', maxScore)
		// 	currentGameState = await handLoop(currentGameState._id)
		// 	maxScore = currentGameState.maxScore
		// }
	};

	///////////////////////////////////////////////////////
	//	Start New Game -
	//		Calls Seed function
	//		Calls Deal function
	//		Spreads new game state to local state variables
	///////////////////////////////////////////////////////
	// const startNewGame = async () => {
	// 	console.log("  starting new Game")
	// 	let resp = await fetch(`${dbUrl}/gameState/seed`)
	// 	let data = await resp.json()
	// 	console.log('got new game', data.data)
	// 	const id   = data.data._id
	// 	console.log('ready to deal', id)
	// 	resp = await fetch(`${dbUrl}/gameState/deal/${id}`)
	// 	data = await resp.json()
	// 	const newGameData = data.data
	// 	// spreadGameState(newGameData)
	// 	console.log('  newly dealt game data', newGameData)
	// return newGameData

	// }

	onMount(gameLoop);
</script>

<main class="game-main">
	<!-- <section class="play-area">
		<PlayDisplay {playedCards} playerOrder={[0, 1, 2, 3]} {gameStatus} />
	</section> -->
	<aside class="south info-area">
		<!-- <button class={passReady ? "shown" : "hidden"} onClick={handlePass}
			>Pass</button
		>
		<button class={playReady ? "shown" : "hidden"} onClick={handlePlay}
			>Play Card</button
		> -->
		<div id="game-phase">
			{`${gamePhase} ${gamePhase === "pass" ? passes.length : ""}`}
		</div>
		<div id="broken-heart">Hearts Broken: {heartsBroken ? "💔" : "⍉"}</div>
	</aside>
	<section class="north hand-area" />
	<section class="east hand-area" />
	<section class="south hand-area">
		{#await $gameState then data}
			<HandDisplay {handleCardClick} cards={data.players[0].hand} />
		{/await}
	</section>
	<section class="west hand-area" />
</main>

<style>
	.game-main {
		height: 99vh;
		width: 99vw;
		display: grid;
		--hand-height: calc(var(--card-height) + 10px);
		grid-template-rows: var(--hand-height) auto var(--hand-height);
		grid-template-columns: var(--hand-height) auto var(--hand-height);
		grid-template-areas:
			" .  hn  .  "
			" hw pa  he "
			" .  hs  ia  ";
	}
	.info-area {
		overflow-x: hidden;
	}
	.hand-area.north {
		grid-area: hn;
	}
	.hand-area.east {
		grid-area: he;
	}
	.hand-area.south {
		grid-area: hs;
	}
	.hand-area.west {
		grid-area: hw;
	}
	.info-area.south {
		grid-area: ia;
	}
	/* .play-area {
		grid-area: pa;
		display: flex;
		justify-content: center;
		align-items: center;
		border:1px solid magenta;
		width: 100%;
		height: 100%;
	}
	.game-sidebar {
		grid-area: side;
	}

	.north .hand-display {
		transform: rotateZ(180deg);
	}
	.east .hand-display {
		transform: rotateZ(-90deg);
	}
	.west .hand-display {
		transform: rotateZ(90deg);
	} */
</style>
