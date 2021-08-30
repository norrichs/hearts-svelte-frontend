<script>
	// import { backOut } from "svelte/easing";
	// import { crossfade } from "svelte/transition";
	// import { flip } from "svelte/animate";

	import CardFront from "./CardFront.svelte";
	import CardBack from "./CardBack.svelte";

	export let cards;
	export let handleSelect;
	export let obscuredMode;
	// console.log("HandDisplay cards:", cards);
</script>

<div class="hand-display">
	<!-- {#if !(cards[0] === "")} -->
	{#each cards as card, i (card.id)}
		{#if !obscuredMode}
			<div
				class="card-container"
				style="--card-number: {i}; --card-count: {cards.length}"
				class:selected={card.selected}
				on:click={() => {
					handleSelect(card.id);
				}}
			>
				<!-- <div class="select-wrapper"  class:selected={card.selected}> -->
				<CardFront cardValue={card.id} />
				<!-- </div> -->
			</div>
		{:else}
			<div
				class="card-container"
				style="--card-number: {i}; --card-count: {cards.length}"
				class:selected={card.selected}
			>
				<CardBack />
			</div>
		{/if}
	{/each}
	<!-- {/if} -->
</div>

<style>
	.hand-display {
		/* border: 1px solid blue; */
		display: grid;
		grid-template-columns: repeat(
			13,
			calc(var(--card-width) * var(--card-overlap-reveal))
		);
		position: relative;
		transform: translateX(calc(var(--card-width) / 2)) translateY(45px);
	
	}
	.card-container {
		border-radius: var(--card-border-radius);
		height: var(--card-height);
		width: calc(var(--card-height) * var(--card-ratio));
		transform-origin: 50% 200%;
		transform: rotateZ(calc(var(--card-number)* 5deg - var(--card-count) * 2.2deg));
		transition: var(--select-speed);
		position: absolute;
		top: -300px;
		box-shadow: 4px 4px 6px 0px black;
	}
	/* .select-wrapper{
		
		border-radius: var(--card-border-radius);
		transition: var(--select-speed);
	} */
	.selected {
		/* transform-origin: inherit; */
		--offset-y: calc(
			var(--card-height) * var(--select-distance) *
				cos(var(--card-hand-rotation))
		);
		--offset-x: calc(
			var(--card-height) * var(--select-distance) *
				sin(var(--card-hand-rotation))
		);
		transform-origin: 50% 250%;
		transform: translateY(-50%) rotateZ(calc(var(--card-number)* 5deg - var(--card-count) * 2.2deg))
			scale(var(--select-scale));
		transition: var(--select-speed);
	}
</style>
