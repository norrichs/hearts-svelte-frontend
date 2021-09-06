<script>
	import { onMount } from "svelte";

	import CardFront from "../components/CardFront.svelte";
	import { played, gS, passMap, userParams } from "../stores.js";
	// export let played;
	let order = [0, 1, 2, 3];
	const directions = ["south", "west", "north", "east"];
	console.log("playDisplay prop", $played);
</script>

{#if $played === null}
	<div>waiting</div>
{:else}
	<div class="play-display">
		<!-- {#each order as place} 
			<div class={directions[(place + $played.first) % 4]}>
				<div class="card-place">
					{#if $played.cards[place]}
						<CardFront cardValue={$played.cards[place]} />
					{/if}
				</div>
			</div>
		{/each} -->
		{#each order as place}
			<div class={directions[place]}>
				<div class="card-place">
					{#if $played.cards[ (place + $userParams.playerNumber - $played.first) % 4]}
						<CardFront cardValue={$played.cards[ (place + $userParams.playerNumber - $played.first) % 4]} />
					{/if}
				</div>
			</div>
		{/each}

		<div class="play-info">
			{#if $gS.phase === "pass"}
				<div>{passMap[$gS.handNum % 4].message}</div>
			{:else if $gS.phase === "trick"}
				<div
					class="turn-arrow"
					style={"transform: rotateZ(" +
						(order[($gS.activePlayer + $userParams.playerNumber) % 4] * 90 - 90) +
						"deg ); "}
				>
					<div />
				</div>
			{:else if $gS.phase === "hand-complete"}
				Hand is complete
			{:else if $gS.phase === "game-complete"}
				Game is complete
			{/if}
		</div>
	</div>
{/if}

<style>
	.turn-arrow {
		/* border: 1px solid black; */
		/* width: calc( var(--card-width) * 0.9);
		height: calc( var(--card-width) * 0.9); */
		width: 100px;
		height: 80px;

		padding-left: 30px;
		background-color: dimgrey;
		border-radius: 60px;
		font-size: 4em;
		color: tomato;
		transition: 400ms;
		display: grid;
		place-items: center;
		overflow: hidden;
		box-sizing: border-box;
	}
	.turn-arrow > div {
		width: 0;
		height: 0;

		border-right: 50px solid transparent;
		border-top: 20px solid transparent;
		border-bottom: 20px solid transparent;
		border-left: 50px solid firebrick;
	}
	.play-display {
		/* background-color: lightskyblue; */
		/* margin: 20px; */
		display: grid;
		grid-template-rows:
			var(--card-height)
			calc(var(--card-height) * var(--card-ratio))
			var(--card-height);
		grid-template-columns:
			var(--card-height)
			calc(var(--card-height) * var(--card-ratio))
			var(--card-height);
		grid-template-areas:
			" .  pn .  "
			" pw pi pe "
			" .  ps .  ";
	}
	.play-display .north {
		grid-area: pn;
	}
	.play-display .east {
		grid-area: pe;
	}
	.play-display .south {
		grid-area: ps;
	}
	.play-display .west {
		grid-area: pw;
	}
	.play-display .play-info {
		grid-area: pi;
	}
	.play-display > div {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.card-place {
		border-radius: var(--card-border-radius);
		height: var(--card-height);
		width: calc(var(--card-height) * var(--card-ratio));
		background-color: yellowgreen;
		position: relative;
	}

	.east .card-place,
	.west .card-place {
		transform: rotateZ(90deg);
	}
</style>
