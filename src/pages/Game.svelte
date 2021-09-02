<script>
	import HandDisplay from "../components/HandDisplay.svelte";
	import PlayDisplay from "../components/PlayDisplay.svelte";
	import TrickPile from "../components/TrickPile.svelte";
	import { navigate } from "svelte-routing";
	import { gS, gameId, played, url, passMap } from "../stores.js";
	import { onDestroy } from "svelte";

	export let user;
	let obscuredMode = true;
	// const localUrl = "http://localhost:4500";
	// const deployedUrl = "https://hearts-backend.herokuapp.com"

	const logState = () => console.log("current gameState:", $gS);
	// Reactive variables



	// Lifecycle
	const unsubscribe = () => {
		gS.subscribe((gS) => {
			navigate("/", { replace: true });
		});
	};
	// onDestroy(()=>gS.unsubscribe)

	// Handler Functions
	const handleSelect = async (cardId) => {
		console.log(" selecting card", $gameId, user, cardId);
		const resp = await fetch(
			`${url}/gameState/selectCard/${$gameId}/${user}/${cardId}`
		);
		const data = await resp.json();
		gS.syncState(data.data);
	};
	const handlePass = async () => {
		console.log("  pass these cards", $gS.players[user].passes);
		const resp = await fetch(`${url}/gameState/passCards/${$gameId}`);
		const data = await resp.json();
		gS.syncState(data.data);
	};
	const handlePlay = async () => {
		console.log("play this card", $gS.players[user].passes);
		const resp = await fetch(
			`${url}/gameState/playCard/${$gameId}/${user}`
		);
		const data = await resp.json();
		gS.syncState(data.data);
	};
	const handleDealHand = async () => {
		console.log(" dealing hand");
		const resp = await fetch(`${url}/gameState/deal/${$gameId}`);
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
</script>

{#if $gS === null}
	<div>waiting</div>
{:else}
	<main class="game-main">
		<section class="play-area">
			<PlayDisplay />
		</section>
		<section class="west hand-area">
			<div class="hand-wrapper">
				<HandDisplay
					{handleSelect}
					cards={$gS.players[1].hand}
					{obscuredMode}
				/>
			</div>
		</section>
		<section class="north hand-area">
			<div class="hand-wrapper">
				<HandDisplay
					{handleSelect}
					cards={$gS.players[2].hand}
					{obscuredMode}
				/>
			</div>
		</section>
		<section class="east hand-area">
			<div class="hand-wrapper">
				<HandDisplay
					{handleSelect}
					cards={$gS.players[3].hand}
					{obscuredMode}
				/>
			</div>
		</section>
		<section class="south hand-area">
			<div class="hand-wrapper">
				<button
					class="game-button"
					class:shown={$gS.phase === "hand-complete"}
					on:click={handleDealHand}>Done!.  Deal next...</button
				>
				<button
					class="game-button"
					class:shown={$gS.phase === "game-complete"}
					on:click={() => {
						navigate("/", { replace: false });
					}}>Somebody Won!</button
				>
				<!-- <button
					class="game-button"
					class:shown={$gS.playedCards.length === 4}
					on:click={handleAccept}>Accept</button
				> -->
				<button
					class="game-button"
					class:shown={$gS.players[user].passes.length === 1 &&
						$gS.phase === "trick"}
					on:click={handlePlay}>Play Card</button
				>
				<button
					class="game-button"
					class:shown={$gS.players[user].passes.length === 3 &&
						$gS.phase === "pass"}
					on:click={handlePass}>Pass</button
				>
				<HandDisplay
					{handleSelect}
					cards={$gS.players[0].hand}
					obscuredMode={false}
				/>
			</div>
		</section>
		<aside class="trick-area">
			<TrickPile {obscuredMode} user="0" />
		</aside>
		<aside class="debug-area">
			<!-- <div>Time - {$time}</div> -->
			<div>backend url : {url}</div>
			<button on:click={logState}>Log State</button>
			<button on:click={handleReveal}>Reveal opponents</button>
			<button on:click={handleSurrenderHand}>Surrender Hand</button>
			<div>Game: {$gameId}</div>
			<div>Hand: {$gS.handNum}</div>
			<div>phase: {$gS.phase}</div>
			<div>
				<span>
					first: {$played.first}
				</span>
				<span>
					played: {$gS.playedCards.map(
						(c) => c.id
					)}{$played.cards.map((c) => c.id)}
				</span>
			</div>
			<div>
				Led: {$played.cards.length > 0 ? $played.cards[0][0] : ""}
			</div>
			<div>Active Player: {$gS.activePlayer}</div>
			<div>{$gS.heartsBroken ? "💔" : "⍉"}</div>
			<div>
				Score: {$gS.maxScore}
				{#each $gS.players as player, i}
					<div>
						<span>Player: {i} </span>
						<span>G[{player.gameScore}]</span>
						<span>H[{player.handScore}]</span>
						<span> # {player.tricks.length / 4}</span>
					</div>
				{/each}
			</div>
		</aside>
	</main>
{/if}

<style>
	.game-main {
		margin: 0 auto;
		box-sizing: border-box;
		height: 99vh;
		width: 99vw;
		overflow: hidden;
		display: grid;
		--hand-height: calc(var(--card-height) + 10px);
		/* grid-template-rows: var(--hand-height) auto var(--hand-height);
		grid-template-columns: var(--hand-height) auto var(--hand-height);
		grid-template-areas:
		" hw  hn  he  "
			" hw  pa  he "
			" i1  hs  i2  "; */
	}
	.game-main {
		grid-template-columns: 10px 300px 1fr 3fr 10px 3fr 1fr 300px 10px;
		grid-template-rows: 10px 300px 3fr 10px 4fr 300px 10px;
		grid-template-areas:
			" .  .  .  .  .  .  .  .  . "
			" .  .  .  .  hn .  .  .  . "
			" .  .  .  pa pa pa .  .  . "
			" .  hw .  pa pa pa .  he . "
			" .  .  .  pa pa pa .  .  . "
			" .  i1 i1 .  hs .  t2 t2 t2"
			" .  i1 i1 .  .  .  t2 t2 t2";
	}
	.game-main > {
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
	/* .info-area {
		grid-area: i2;
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
		border: 1px solid magenta;
		width: 100%;
		height: 100%;
	}
	.north .hand-wrapper {
		transform: translateY(calc(0px - var(--hand-height) * 0.65))
			rotateZ(180deg);
	}
	.east .hand-wrapper {
		transform: translateX(calc(var(--hand-height) * 0.65)) rotateZ(-90deg);
	}
	.west .hand-wrapper {
		transform: translateX(calc(0px - var(--hand-height) * 0.65))
			rotateZ(90deg);
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
	.trick-area {
		grid-area: t2;
		background-color: burlywood;
		border: 4px solid black;
	}
</style>
