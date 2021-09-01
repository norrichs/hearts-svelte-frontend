<script>
	import { gS } from "../stores.js";
	import CardFront from "./CardFront.svelte";
	import CardBack from "./CardBack.svelte";
	export let obscuredMode;
	export let user;
</script>

{#if ($gS === null)}
	<section>...Waiting</section>
{:else}
	<section style="--trick-count: {$gS.players[user].tricks.length}">
		{#each $gS.players[user].tricks as card, i (card.id)}
			{#if obscuredMode}
				<div class="card-container">
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

	.card-container {
		border-radius: var(--card-border-radius);
		height: var(--card-height);
		width: calc(var(--card-height) * var(--card-ratio));
		transform-origin: 50% 200%;
		transform: rotateZ(
			calc(var(--card-number) * 5deg - var(--card-count) * 2.2deg)
		);
		transition: var(--select-speed);
		position: absolute;
		top: -300px;
		box-shadow: 4px 4px 6px 0px black;
	}
</style>
