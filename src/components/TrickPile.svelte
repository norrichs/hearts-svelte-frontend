<script>
	import { gS } from "../stores.js";
	import CardFront from "./CardFront.svelte";
	import CardBack from "./CardBack.svelte";
	export let obscuredMode;
	export let user=0;
</script>

{#if $gS === null}
	<section>...Waiting</section>
{:else}
	<h2>Tricks</h2>
	<section style="--trick-count: {$gS.players[user].tricks.length}">
		{#each $gS.players[user].tricks as card, i (card.id)}
			<!-- <div class='card-container'>{card.id}</div> -->

			{#if obscuredMode}
				<div class="trick-card-container">
					<CardFront cardValue={card.id} />
				</div>
			{:else}
				<div class="card-container">
					<CardBack />
				</div>
			{/if}
		{/each}
	</section>
{/if}

<style>
	section {
		display: grid;
		grid-template-columns: repeat(
			var(--trick-count),
			calc(var(--card-width) * var(--card-overlap-reveal))
		);
	}

	.trick-card-container {
		border-radius: var(--card-border-radius);
		height: calc( var(--card-height) * var(--trick-card-scale));
		width: calc(var(--card-width) * var(--trick-card-scale));
		transform: rotateZ(0deg);
		transition: var(--select-speed);
		/* position: absolute; */
		/* top: -300px; */
		box-shadow: 4px 4px 6px 0px black;
	}
</style>
