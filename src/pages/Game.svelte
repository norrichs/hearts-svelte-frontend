<script>
	import HandDisplay from "../components/HandDisplay.svelte";
	import PlayDisplay from "../components/PlayDisplay.svelte";
	import TrickPile from "../components/TrickPile.svelte";
	import { navigate } from "svelte-routing";
	import { gS, played, url, userParams } from "../stores.js";
	import { createEventDispatcher, onDestroy, onMount } from "svelte";

	let obscuredMode = true;
	// const localUrl = "http://localhost:4500";
	// const deployedUrl = "https://hearts-backend.herokuapp.com"

	const logState = () => console.log("current gameState:", $gS);
	// Reactive variables

	// Lifecycle
	const unsubscribe = () => {
		gS.subscribe();
	};
	// onDestroy(()=>gS.unsubscribe)

	// Handler Functions
	const handleSelect = async (cardId) => {
		console.log(
			" selecting card",
			$userParams.gameId,
			$userParams.playerNumber,
			cardId
		);
		const resp = await fetch(
			`${url}/gameState/selectCard/${$userParams.gameId}/${$userParams.playerNumber}/${cardId}`
		);
		const data = await resp.json();
		gS.syncState(data.data);
	};
	const handlePass = async () => {
		console.log(
			"  pass these cards",
			$gS.players[$userParams.playerNumber].passes
		);
		const resp = await fetch(
			`${url}/gameState/passCards/${$userParams.gameId}`
		);
		const data = await resp.json();
		gS.syncState(data.data);
	};
	const handlePlay = async () => {
		console.log(
			"play this card",
			$gS.players[$userParams.playerNumber].passes
		);
		const resp = await fetch(
			`${url}/gameState/playCard/${$userParams.gameId}/${$userParams.playerNumber}`
		);
		const data = await resp.json();
		gS.syncState(data.data);
	};
	const handleDealHand = async () => {
		console.log(" dealing hand");
		const resp = await fetch(`${url}/gameState/deal/${$userParams.gameId}`);
		const data = await resp.json();
		console.log(" - newly dealt hand gamedata", data.data);
		return data.data;
	};
	const handleReveal = () => {
		obscuredMode = obscuredMode ? false : true;
	};
	const handleAccept = () => {
		console.log("accept");
	};
	const handleSurrenderHand = () => {
		console.log("surrender this hand, take all remaining hearts");
	};

	onMount(() => {
		console.log(
			"game mounted user",
			$userParams.username,
			"load game",
			$userParams.gameId
		);
		gS.loadGame($userParams.gameId, $userParams.playerNumber);
	});
	onDestroy(() => unsubscribe());
</script>

{#if $gS === null}
	<div>waiting</div>
{:else}
	<main class="game-main">
		<section class="control-area">
			<button on:click={() => navigate("/lobby")}>Back to Lobby</button>
		</section>
		<section class="play-area">
			<PlayDisplay />
		</section>
		<div class="west name-label">
			<div>{$gS.players[($userParams.playerNumber + 1) % 4].name}</div>
		</div>
		<section class="west hand-area">
			<div class="hand-wrapper">
				<HandDisplay
					{handleSelect}
					cards={$gS.players[($userParams.playerNumber + 1) % 4].hand}
					{obscuredMode}
				/>
			</div>
		</section>
		<div class="north name-label">
			<div>{$gS.players[($userParams.playerNumber + 2) % 4].name}</div>
		</div>
		<section class="north hand-area">
			<div class="hand-wrapper">
				<HandDisplay
					{handleSelect}
					cards={$gS.players[($userParams.playerNumber + 2) % 4].hand}
					{obscuredMode}
				/>
			</div>
		</section>
		<div class="east name-label">
			<div>{$gS.players[($userParams.playerNumber + 3) % 4].name}</div>
		</div>
		<section class="east hand-area">
			<div class="hand-wrapper">
				<HandDisplay
					{handleSelect}
					cards={$gS.players[($userParams.playerNumber + 3) % 4].hand}
					{obscuredMode}
				/>
			</div>
		</section>

		<div class="south name-label">
			<div>{$gS.players[$userParams.playerNumber].name}</div>
		</div>
		<section class="south hand-area">
			<div class="hand-wrapper">
				<button
					class="game-button"
					class:shown={$gS.phase === "hand-complete"}
					on:click={handleDealHand}>Done!. Deal next...</button
				>
				<button
					class="game-button"
					class:shown={$gS.phase === "game-complete"}
					on:click={() => {
						navigate("/lobby", { replace: false });
					}}>Somebody Won!</button
				>
				<!-- <button
					class="game-button"
					class:shown={$gS.playedCards.length === 4}
					on:click={handleAccept}>Accept</button
				> -->
				<button
					class="game-button"
					class:shown={$gS.players[$userParams.playerNumber].passes
						.length === 1 && $gS.phase === "trick"}
					on:click={handlePlay}>Play Card</button
				>
				<button
					class="game-button"
					class:shown={$gS.players[$userParams.playerNumber].passes
						.length === 3 && $gS.phase === "pass"}
					on:click={handlePass}>Pass</button
				>
				<HandDisplay
					{handleSelect}
					cards={$gS.players[$userParams.playerNumber].hand}
					obscuredMode={false}
				/>
			</div>
		</section>
		<aside class="trick-area">
			<TrickPile {obscuredMode} user={$userParams.playerNumber} />
		</aside>
		<aside class="info-area">
			<div><span>Play to:</span><span>{$gS.winScore}</span></div>
			<div>Hearts Broken: {$gS.heartsBroken ? "💔" : "⍉"}</div>
			<dl class="score-grid">
				<dt>Player</dt>
				<dt>G</dt>
				<dt>H</dt>
				<dt>T</dt>
				<!-- <dt>#</dt>
				<dt>Played</dt>
				<dt>-</dt>
				<dt>-</dt> -->
				{#each $gS.players as p, i}
					<dd class:active-player={$gS.activePlayer === i}>
						{p.name}
					</dd>
					<dd>{p.gameScore}</dd>
					<dd>{p.handScore}</dd>
					<dd>{p.tricks.length / 4}</dd>
					<!-- <dd>{i}</dd>
					<dd>{$played.cards[(i + 4 - $played.first) % 4]}</dd>
					<dd>-</dd>
					<dd>-</dd> -->
				{/each}
			</dl>
		</aside>
	</main>
{/if}

<style>
	.info-area {
		grid-area: i1;
	}
	.info-area > div {
		font-size: 1.5em;
	}
	.score-grid {
		border: 5px solid black;
		--score-data-columns: 3;
		width: calc(150px + var(--score-data-columns) * 55px);
		/* max-width: calc(100% - 50px); */
		display: grid;
		grid-template-columns: auto repeat(var(--score-data-columns), 50px);
		grid-template-rows: repeat(4, auto);
		gap: 5px;
		background-color: dimgray;
		grid-auto-flow: row;
		/* grid-template-areas:
			"nt gt ht tt"
			"n0 g0 h0 t0"
			"n1 g1 h1 t1"
			"n2 g2 h2 t2"
			"n3 g3 h3 t30" */
	}
	dt,
	dd {
		justify-content: start;
		margin-inline: 0;
		padding: 3px;
	}
	dl.score-grid > dt {
		font-size: 1em;
		color: black;
	}
	dl.score-grid > dd {
		background-color: white;
		/* padding: 5px; */
		/* color:dodgerblue; */
	}
	dl.score-grid > dd.active-player {
		background: rgba(220, 10, 10, 0.6);
	}

	.game-main {
		margin: 0 auto;
		box-sizing: border-box;
		min-height: 820px;
		min-width: 820px;
		height: 99vh;
		width: 98vw;
		overflow: hidden;
		display: grid;
		--hand-height: calc(var(--card-height) + 10px);
	}
	.game-main {
		grid-template-columns: 10px 3fr 1fr 200px 10px 200px 1fr 3fr 10px;
		grid-template-rows: 10px 3fr 200px 10px 200px 3fr 10px;
		grid-template-areas:
			" c1 c1 .  .  nn .  .  .  . "
			" c1 c1 .  .  hn .  .  .  . "
			" .  .  .  pa pa pa .  .  . "
			" nw hw .  pa pa pa .  he ne"
			" .  .  .  pa pa pa .  .  . "
			" .  i1 i1 .  hs .  t2 t2 t2"
			" .  i1 i1 .  ns .  t2 t2 t2";
	}
	.name-label {
		position: relative;
	}
	.name-label > div{
		position:absolute;
		font-size: 2em;
		border-radius: 10px;
		border: 1px solid black;
		background-color: burlywood;
		padding: 5px;
	}
	.name-label.north > div{
		top: 10px;
	}
	.name-label.west > div{
		left: 10px;
	}
	.name-label.east > div{
		right: 10px;
	}
	.name-label.south > div{
		bottom: 10px;
	}
	.name-label.north {
		grid-area: nn;
	}
	.name-label.east {
		grid-area: ne;
	}
	.name-label.south {
		grid-area: ns;
	}
	.name-label.west {
		grid-area: nw;
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
	.control-area {
		grid-area: c1;
	}
	/* .debug-area {
		grid-area: i1;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-end;
		background-color: lightsteelblue;
	} */
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
	.game-button:active {
		background-color: rgba(220, 10, 10, 0.9);
	}
	.play-area {
		grid-area: pa;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
	}
	.hand-area {
		/* display: flex;
		justify-content: flex-end;
		align-items: flex-end; */
		--hand-offset: 150px;
		position: relative;
		/* background-color: red; */
	}
	.hand-wrapper {
		/* background-color: blue; */
		height: 100%;
		width: 1px;

		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.north .hand-wrapper {
		bottom: var(--hand-offset);
		transform: rotateZ(180deg);
	}
	.east .hand-wrapper {
		left: var(--hand-offset);
		transform: rotateZ(-90deg);
	}
	.west .hand-wrapper {
		right: var(--hand-offset);
		transform: rotateZ(90deg);
	}
	.south .hand-wrapper {
		top: var(--hand-offset);
	}

	.trick-area {
		grid-area: t2;
		background-color: burlywood;
		border: 4px solid black;
		padding: 10px;
	}
</style>
