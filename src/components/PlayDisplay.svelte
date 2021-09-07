<script>
	import CardFront from "../components/CardFront.svelte";
	import { played, gS, passMap, userParams, arrowAngle, user } from "../stores.js";
	// export let played;
	let order = [0, 1, 2, 3];
	const directions = ["south", "west", "north", "east"];
	console.log("playDisplay prop", $played);

	let arrowDelta;
	let previousArrowAngle = 270 + 90 * $userParams.playerNumber;
	let arrowCumulativeAngle = 0;

	// REACTIVE CODE BLOCK
	// 	runs whenever $arrowAngle updated
	//	check if $arrowAntle actually changed, then calculate a cumulative angle
	$: if ($arrowAngle !== previousArrowAngle) {
		arrowDelta =
			$arrowAngle > previousArrowAngle
			? $arrowAngle - previousArrowAngle
			: $arrowAngle - previousArrowAngle + 360;
		arrowCumulativeAngle = arrowCumulativeAngle + arrowDelta;
		previousArrowAngle = $arrowAngle;

	}
</script>

{#if $played === null}
	<div>waiting</div>
{:else}
	<div class="play-display">
		{#each order as place, i}
			<div class={directions[place]}>
				<div class="card-place">
					{#if $played.cards[(i + 4 - $played.first + $userParams.playerNumber) % 4]}
						<CardFront
							cardValue={$played.cards[
								(i +
									4 -
									$played.first +
									$userParams.playerNumber) %
									4
							]}
						/>
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
					style={"--turn-arrow-rotation: " +
						arrowCumulativeAngle +
						"deg"}
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
		width: 100px;
		height: 80px;

		padding-left: 30px;
		background-color: dimgrey;
		border-radius: 50%;
		font-size: 4em;
		color: tomato;
		display: grid;
		place-items: center;
		overflow: hidden;
		box-sizing: border-box;

		transform: rotateZ(var(--turn-arrow-rotation));
		transition: 400ms;
		/* " +
						(order[($gS.activePlayer + $userParams.playerNumber) % 4] * 90 - 90) +
						"deg ); " */
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
			" dd pn .  "
			" pw pi pe "
			" .  ps .  ";
	}
	.debug-display {
		background-color: cornflowerblue;
		grid-area: dd;
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
