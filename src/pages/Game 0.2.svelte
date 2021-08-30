<script>
	import { onDestroy, onMount } from "svelte";
	import { flip } from "svelte/animate";
	import HandDisplay from "../components/HandDisplay.svelte";
	import PlayDisplay from '../components/PlayDisplay.svelte';
	import { gS, userHand, westHand, northHand, eastHand, playedCards } from "../stores.js";

	// props
	// export let dbUrl;
	export let user;
	let obscuredMode = true;

	// Reactive state variables
	let handCards = [];
	let northCards = [];
	let eastCards = [];
	let westCards = [];
	let played = {firstPlayer: 0, cards: []};
	let passReady = false;
	let playReady = false;
	let currentGS = {};
	let maxScore;
	// Game variables

	const passMap = [
		{
			message: "pass across",
		},
		{
			message: "pass left",
		},
		{
			message: "pass right",
		},
		{
			message: "no pass",
		},
	];

	////////////////////////
	// Utility Functions
	////////////////////////

	// refresh all reactive variables, resolving promises outside of markup
	const refresh = async () => {
		handCards = await $userHand;
		westCards = await $westHand;
		northCards = await $northHand;
		eastCards = await $eastHand;
		currentGS = await $gS;
		played = await $playedCards
		console.log('refresh played', played)
		maxScore = currentGS.maxScore;
	};

	// async wrapper function for timeout
	const loopDelay = (ms) => {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve("");
			}, ms);
		});
	};

	//

	// Handler Functions
	const handleCardClick = async (id) => {
		let currentGameState = await $gS;
		console.log("clicked, current state", currentGameState, "cardId", id);
		gS.selectCard(id, user);
		await refresh();

		if (currentGS.phase === "pass") {
			passReady =
				currentGS.players[user].passes.length === 3 ? true : false;
		} else if (currentGS.phase === "trick") {
			playReady =
				currentGS.players[user].passes.length === 1 ? true : false;
		}
	};

	const handlePass = async () => {
		console.log("pass these cards", currentGS.players[user].passes);
		gS.passCards();
		passReady = false;
		await refresh();
	};
	const handlePlay = async () => {
		console.log("play this card", currentGS.players[user].passes);
		gS.playCard();
		playReady = false
		await refresh();
	};

	// TODO update for SVELTE

	// const isValidPlaySelection = (id) => {
	// 	const ledSuit = gameState.playedCards[0][0];
	// 	console.log(
	// 		"isValid? ",
	// 		card,
	// 		"ledSuit",
	// 		ledSuit,
	// 		gameState.trickNum,
	// 		userHand.includes("c2")
	// 	);

	// 	if (gameState.trickNum === 1 && userHand.includes("c2")) {
	// 		alert("play c2, approved");
	// 		return card === "c2";
	// 	} else if (gameState.playedCards.length === 0) {
	// 		if (gameState.heartsBroken) return true;
	// 		else return card[0] !== "h";
	// 	} else if (userHand.map((c) => c[0]).includes(ledSuit))
	// 		return card[0] === ledSuit;
	// 	else return true;
	// };

	////////////////
	// GAME LOOPS //
	////////////////
	const gameLoop = async () => {
		console.log("enter gameLoop", $gS);
		// Create new game and deal first hand
		gS.newGame();
		await refresh();
		const winScore = currentGS.winScore;
		//loop until win condition
		let counter = 0; //TODO remove for production
		while (maxScore < winScore) {
			console.log("start new hand, current maxScore", maxScore);
			await handLoop();
			await refresh();
			if (counter === 100) maxScore = winScore;
			counter += 1; //TODO remove for production
		}
		console.log("exiting game loop");
	};

	const handLoop = async () => {
		console.log("  enter hand loop:", currentGS.handNum);
		//Enter pass phase
		await passLoop();
		await refresh();
		//Enter trick taking phase
		let trickNum = 1;
		while (trickNum <= 13) {
			await loopDelay(3000);
			await trickLoop();
			refresh();
			trickNum = currentGS.trickNum;
		}
	};

	const passLoop = async () => {
		console.log("    enter pass loop", passMap[currentGS.handNum].message);

		let counter = 0;
		while (currentGS.phase === "pass") {
			console.log("    [" + counter + "]");
			await loopDelay(100);
			refresh();
			counter++;
		}
	};

	const trickLoop = async () => {
		console.log(
			"      enter trick loop.  Player " +
				currentGS.activePlayer +
				" turn"
		);
		let waiting = true;
		let inProgress = true;

		let counter = 0;
		while (inProgress) {
			if (currentGS.activePlayer === user) {
				console.log(
					"        waiting on user to play card [" + counter + "]"
				);
				await loopDelay(3000);
			} else {
				console.log(
					`        waiting on ${
						currentGS.players[currentGS.activePlayer].name
					} to play card [${counter}]`
				);
				await loopDelay(3000);
				refresh();
			}
			counter++;
		}
	};

	onMount(gameLoop);
</script>

<main class="game-main">
	<!-- <section class="play-area">
		<PlayDisplay {playedCards} playerOrder={[0, 1, 2, 3]} {gameStatus} />
	</section> -->
	<aside class="info-area">
		<div id="game-phase">
			{#if currentGS.phase === "pass"}
				Pass {currentGS.players[user].passes.length}
			{:else if currentGS.phase === "trick"}
				Trick {currentGS.trickNum}
			{/if}
		</div>
		<div id="game-hand">
			Hand #: {currentGS.handNum}
		</div>
		<div id="game-turn">
			{#if currentGS.phase === "pass"}
				Waiting for: {currentGS.players
					.filter((p) => p.passes.length < 3)
					.map((p) => p.name)} to select 3 cards
			{:else if currentGS.phase === "trick"}
				Waiting for {currentGS.players[currentGS.activePlayer].name} to select
				a card
			{/if}
		</div>

		<div id="broken-heart">
			Hearts Broken: {$gS.heartsBroken ? "💔" : "⍉"}
		</div>
	</aside>
	<aside class="debug-area">
		Played Cards:
		{#if currentGS.phase === "trick"}
			{#each played.cards as card}
				<span>{card}</span>
			{/each}
		{/if}
	</aside>
	<section class="play-area">
		<PlayDisplay {played}/>
	</section>
	<section class="north hand-area">
		<div class="hand-wrapper">
			<HandDisplay {handleCardClick} cards={northCards} {obscuredMode} />
		</div>
	</section>

	<section class="east hand-area">
		<div class="hand-wrapper">
			<HandDisplay {handleCardClick} cards={eastCards} {obscuredMode} />
		</div>
	</section>
	<section class="south hand-area">
		<div class="hand-wrapper">
			<button
				class="game-button play"
				class:shown={playReady && currentGS.phase === "trick"}
				on:click={handlePlay}>Play Card</button
			>
			<button
				class="game-button"
				class:shown={passReady && currentGS.phase === "pass"}
				on:click={handlePass}>Pass</button
			>
			<HandDisplay
				{handleCardClick}
				cards={handCards}
				obscuredMode={false}
			/>
		</div>
	</section>
	<section class="west hand-area">
		<div class="hand-wrapper">
			<HandDisplay {handleCardClick} cards={westCards} {obscuredMode} />
		</div>
	</section>
</main>

<style>
	.game-main {
		margin: 0 auto;
		box-sizing: border-box;
		height: 99vh;
		width: 99vw;
		overflow: hidden;
		display: grid;
		--hand-height: calc(var(--card-height) + 10px);
		grid-template-rows: var(--hand-height) auto var(--hand-height);
		grid-template-columns: var(--hand-height) auto var(--hand-height);
		grid-template-areas:
			" hw  hn  he  "
			" hw  pa  he "
			" i1  hs  i2  ";
	}
	.game-main{
		grid-template-columns: 10px 300px 1fr 3fr 10px 3fr 1fr 300px 10px;
		grid-template-rows: 10px 300px 3fr 10px 4fr 300px 10px;
		grid-template-areas: 
			" .  .  .  .  .  .  .  .  . "
			" .  .  .  .  hn .  .  .  . "
			" .  .  .  pa pa pa .  .  . "
			" .  hw .  pa pa pa .  he . "
			" .  .  .  pa pa pa .  .  . "
			" .  i1 i1 .  hs .  i2 i2 . "
			" .  i1 i1 .  .  .  i2 i2 . "
			;
	}
	.game-main>{
		border: 1px solid black;
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
	.debug-area {
		grid-area: i1;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-end;
		background-color: lightsteelblue;
	}
	.info-area {
		grid-area: i2;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-end;
		background-color: lightsteelblue;
	}
	button.game-button.shown {
		visibility: visible;
		bottom: 100px;
		transition: 500ms;
	}
	.game-button {
		visibility: hidden;
		background-color: rgba(220, 10, 10, 0.6);
		border: 5px solid rgba(100, 10, 10, 0.9);
		box-shadow: 0 0 10px 2px rgba(100, 10, 10, 0.9);
		font-size: 4em;
		position: absolute;
		bottom: -200px;
		z-index: 100;
		border-radius: 0.25em;
		transition: 500ms;
	}
	.game-button:active{

		background-color: rgba(220, 10, 10, .9);
	}
	.play-area {
		grid-area: pa;
		display: flex;
		justify-content: center;
		align-items: center;
		border:1px solid magenta;
		width: 100%;
		height: 100%;
	}	
	.north .hand-wrapper {
		transform: translateY(calc( 0px - var(--hand-height) * 0.65)) rotateZ(180deg);
	}
	.east .hand-wrapper {
		transform: translateX(calc( var(--hand-height) * 0.65)) rotateZ(-90deg);
	}
	.west .hand-wrapper {
		transform: translateX(calc( 0px - var(--hand-height) * 0.65)) rotateZ(90deg);
	}	
	.south .hand-wrapper {
		transform: translateY(calc(var(--hand-height) * 0.65));
	}
	.hand-area {
		display: flex;
		justify-content: center;
		align-items: center;
		/* position: relative; */
		background-color: sandybrown;
	}
	.hand-wrapper {
		background-color: blue;
		height: 100%;
		width: 1px;

		/* position: absolute; */
		top: 0;
		left: 50%;
		
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
