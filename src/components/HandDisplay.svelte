
<script>
	import CardFront from "./CardFront.svelte";
	export let cards;
	export let handleCardClick
	console.log('HandDisplay cards:', cards	)
</script>

<div class="hand-display">
	{#if !(cards[0]==="")}
		{#each cards as card (card.id)}
			<div class='card-container' class:selected={card.selected} on:click={()=>{handleCardClick(card.id)}}>
				<CardFront cardValue={card.id} />
			</div>
		{/each}
	{/if}
</div>

<style>
	.hand-display {
		/* border: 1px solid blue; */
		display: grid;
		grid-template-columns: repeat(13, calc(var(--card-width) * 0.25));
	}
	.card-container {
		border-radius: var(--card-border-radius);
		height: var(--card-height);
		width: calc(var(--card-height) * var(--card-ratio));
		box-shadow: 4px 4px 6px 0 black;
		display: grid;
		grid-template-rows: 1fr 1fr 1fr;
		transform: rotateZ(0deg);
		transition: 300ms;
	}
	.selected {
		transform: translateY(calc(var(--card-height) * -0.6));
		transition: 300ms;
	}
</style>
