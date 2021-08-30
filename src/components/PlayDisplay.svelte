<script>
	import { onMount } from "svelte";

	import CardFront from "../components/CardFront.svelte";
	import { played } from "../stores2.js";
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
				{(place + $played.first) % 4}
				<div class="card-place">
					{#if $played.cards[place]}
						<CardFront cardValue={$played.cards[place]} />
					{/if}
				</div>
			</div>
		{/each}
		<div class="play-info">
			{#if $played.cards.length > 0}
				{$played.first}
				{$played.cards}
			{:else}
				No played
			{/if}
			<!-- {gameStatus} -->
		</div>
	</div>
{/if}

<style>
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
	}
	.east .card-place,
	.west .card-place {
		transform: rotateZ(90deg);
	}
</style>
