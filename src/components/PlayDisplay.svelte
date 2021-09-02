<script>
	import { onMount } from "svelte";

	import CardFront from "../components/CardFront.svelte";
	import { played, gS, passMap } from "../stores.js";
	// export let played;
	let order = [0, 1, 2, 3];
	const directions = ["south", "west", "north", "east"];
	console.log("playDisplay prop", $played);
</script>

{#if $played === null}
	<div>waiting</div>
{:else}
	<div class="play-display">
		{#each order as place}
			<div class={directions[(place + $played.first) % 4]}>
				<div class="card-place">
					{#if $played.cards[place]}
						<!-- <div class="indicator">
							{$played.cards[place]}
						</div> -->
						<CardFront cardValue={$played.cards[place]} />
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
						(order[$gS.activePlayer] * 90 + 90) +
						"deg );"}
				>
					>
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
		font-size: 3em;
	}
	.play-display {
		background-color: lightskyblue;
		margin: 20px;
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
	.indicator {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background-color: rgba(200, 100, 200, 1);
		position: absolute;
		top: 50%;
		left: 50%;
		display: grid;
		place-items: center;
		font-size: 1em;
		transform-origin: 50% 50%;
		z-index: 20;
	}
	.east .card-place,
	.west .card-place {
		transform: rotateZ(90deg);
	}
</style>
