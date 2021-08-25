<script>
	import CardFront from "../components/CardFront.svelte";
</script>

<div class="play-display">
	<div class="south">
		<div class="card-place">hello
			<!-- {playedCards[playerOrder[0]] ? (
				<CardFront
					cardValue={playedCards[playerOrder[0]]}
					handleSelectCard={"none"}
				/>
			) : null} -->
		</div>
	</div>
	<div class="west">
		<div class="card-place">
			<!-- {playedCards[playerOrder[1]] ? (
				<CardFront
					cardValue={playedCards[playerOrder[1]]}
					handleSelectCard={"none"}
				/>
			) : null} -->
		</div>
	</div>
	<div class="north">
		<div class="card-place">
			<!-- {playedCards[playerOrder[2]] ? (
				<CardFront
					cardValue={playedCards[playerOrder[2]]}
					handleSelectCard={"none"}
				/>
			) : null} -->
		</div>
	</div>
	<div class="east">
		<div class="card-place">
			<!-- {playedCards[playerOrder[3]] ? (
				<CardFront
					cardValue={playedCards[playerOrder[3]]}
					handleSelectCard={"none"}
				/>
			) : null} -->
		</div>
	</div>
	<div class="play-info">
		<!-- {gameStatus} -->
	</div>
</div>

<style>
	
	.play-display {
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
