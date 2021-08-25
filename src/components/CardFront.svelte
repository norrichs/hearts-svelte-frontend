<script>
	export let cardValue;
	import { onMount } from "svelte";

	let symbolArray = new Array(10);
	const valueText = [
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"10",
		"J",
		"Q",
		"K",
		"A",
	];
	const suits = {
		c: String.fromCharCode(0x2663),
		s: String.fromCharCode(0x2660),
		d: String.fromCharCode(0x2666),
		h: String.fromCharCode(0x2665),
	};
	$: suit = cardValue[0]; //cardValue[0];
	$: value = parseInt(cardValue.substr(1));

	// console.log(cardValue);
	onMount(() => {
		// console.log("suit", suits[suit], "value", value);
		symbolArray = new Array(value);
		symbolArray.fill(suits[suit]);
		// console.log("array length", symbolArray.length);
		// symbolArray = [...symbolArray];
	});
</script>

<div class={`card-front suit-${suit}`}>

	<div class="value">
		<div>{valueText[value - 2]}</div>
		<div>{suits[suit]}</div>
	</div>
	<div class="symbol-wrapper">
		{#if value < 11}
			<div class="symbol-display numeric">
				<div class="symbol sym-b1">
					{symbolArray.length > 0 ? symbolArray[0] : ""}
				</div>
				<div class="symbol sym-b2">
					{symbolArray.length > 1 ? symbolArray[1] : ""}
				</div>
				<div class="symbol sym-s1">
					{symbolArray.length > 2 ? symbolArray[2] : ""}
				</div>
				<div class="symbol sym-s2">
					{symbolArray.length > 3 ? symbolArray[3] : ""}
				</div>
				<div class="symbol sym-s3">
					{symbolArray.length > 4 ? symbolArray[4] : ""}
				</div>
				<div class="symbol sym-s4">
					{symbolArray.length > 5 ? symbolArray[5] : ""}
				</div>
				<div class="symbol sym-s5">
					{symbolArray.length > 6 ? symbolArray[6] : ""}
				</div>
				<div class="symbol sym-s6">
					{symbolArray.length > 7 ? symbolArray[7] : ""}
				</div>
				<div class="symbol sym-s7">
					{symbolArray.length > 8 ? symbolArray[8] : ""}
				</div>
				<div class="symbol sym-s8">
					{symbolArray.length > 9 ? symbolArray[9] : ""}
				</div>
			</div>
		{:else}
			<div class="symbol-display nominal">
				<div class="symbol sym-bb">{suits[suit]}</div>
			</div>
		{/if}
	</div>
	<div class="value">
		<div>{valueText[value - 2]}</div>
		<div>{suits[suit]}</div>
	</div>
</div>

<style>
	/* debug */
	.value,
	.symbol {
		box-sizing: border-box;
		/* border: 1px solid gray; */
	}

	.value {
		padding: 5px 0px 0px 5px;
		align-items: flex-end;
		overflow: visible;
		background-color: transparent;
	}
	.value:last-of-type {
		transform: rotateZ(180deg);
	}
	.value div:last-of-type {
		font-size: 0.75em;
		background-color: transparent;
	}
	.card-front {
		background-color: var(--cardfront-background);
		border-radius: var(--card-border-radius);
	}
	.suit-d,
	.suit-h {
		color: var(--redsuit-color);
	}

	.suit-s,
	.suit-c {
		color: var(--blacksuit-color);
	}
	.symbol-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.symbol-display.numeric {
		/* grid-template: 
		" .  b1 b1 .  .  " 1fr
		" .  b1 b1 s5 s7 " 1fr
		" s4 s2 .  s1 s3 " 1fr
		" s8 s6 b2 b2 .  " 1fr
		" .  .  b2 b2 .  " 1fr / 1fr 1fr 1fr 1fr 1fr; */
		display: grid;
		grid-template-rows: 1em 1em 0.75em 1em 1em;
		grid-template-columns: 1em 1em 1em 1em 1em;
		grid-template-areas:
			" .  b1 b1 .  .  "
			" .  b1 b1 s5 s7 "
			" s4 s2 .  s1 s3 "
			" s8 s6 b2 b2 .  "
			" .  .  b2 b2 .  ";
	}
	.symbol-display.nominal {
		display: grid;
		grid-template-rows: 1em 1em 0.75em 1em 1em;
		grid-template-columns: 1em 1em 1em 1em 1em;
		grid-template-areas:
			" .  .  .  .  .  "
			" .  bb bb bb .  "
			" .  bb bb bb .  "
			" .  bb bb bb .  "
			" .  .  .  .  .  ";
		/* grid-template-columns: 1fr;
		grid-template-rows: 1fr;
		grid-template-areas: " bb "; */
		justify-content: center;
		align-items: center;
	}

	.symbol {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.sym-b1,
	.sym-b2 {
		font-size: 2em;
	}
	.sym-s1,
	.sym-s2,
	.sym-s3,
	.sym-s4,
	.sym-s5,
	.sym-s6,
	.sym-s7,
	.sym-s8 {
		font-size: 1em;
	}
	.sym-b1,
	.sym-s1,
	.sym-s3,
	.sym-s5,
	.sym-s7 {
		transform: rotateZ(0.1deg);
	}

	.sym-b2,
	.sym-s2,
	.sym-s4,
	.sym-s6,
	.sym-s8 {
		transform: rotateZ(180deg);
	}
	.sym-bb {
		grid-area: bb;
		font-size: 4em;
	}
	.sym-b1 {
		grid-area: b1;
	}
	.sym-b2 {
		grid-area: b2;
	}
	.sym-s1 {
		grid-area: s1;
	}
	.sym-s2 {
		grid-area: s2;
	}
	.sym-s3 {
		grid-area: s3;
	}
	.sym-s4 {
		grid-area: s4;
	}
	.sym-s5 {
		grid-area: s5;
	}
	.sym-s6 {
		grid-area: s6;
	}
	.sym-s7 {
		grid-area: s7;
	}
	.sym-s8 {
		grid-area: s8;
	}
</style>
