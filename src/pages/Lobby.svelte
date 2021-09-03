<script>
	import { url,  } from "../stores.js";
	import { onMount } from "svelte";
	import {Link, navigate } from "svelte-routing"

	let gamesList = null;
	let joined = false;





	const startSinglePlayer = () => {
		
	}

	const refreshGamesList = async () => {
		const resp = await fetch(`${url}/gameState/listGames`);
		const data = await resp.json();
		console.log("refreshGamesList", data.data);
		return data.data;
	};
	const fetchNewGame = async () => {
		console.log(" starting new game");
		const resp = await fetch(`${url}/gameState/seed`);
		const data = await resp.json();
		console.log(" - got new game", data);
		if (data.status === 200) {
			gamesList = await refreshGamesList();
		}
	};
	const handleClear = async () => {

		let confirmed = confirm("Really end all in-progress games?")
		if(confirmed){
			const resp = await fetch(`${url}/gameState/clear`);
			gamesList = await refreshGamesList()
		}
	};
	onMount(async () => {
		gamesList = await refreshGamesList();
	});
</script>






<main>
	<h2>Games</h2>
	<button on:click={handleClear}>End All Games</button>
	<button on:click={fetchNewGame}>Add game</button>
	<button on:click={startSinglePlayer}>Start Single Player Game</button>
	<ul class="game-listing">
		{#if gamesList !== null}
			{#each gamesList as game}
				<li class="listed-game">
					<div 
						class="players"
						class:open={game.phase==='open'}
					>
						{#each game.players as p}
							<div 
								class={p.playerType}
								
							>{p.name}</div>
						{/each}
					</div>
					<button on:click={console.log('start a game')}>Start!</button>
				</li>
			{/each}
		{:else}
			<li>waiting</li>
		{/if}
	</ul>
</main>

<style>
	.game-listing{
		max-width:600px;
	}
	.listed-game{
		display: flex;
		flex-direction: row;

	}
	.players {
		display: flex;
		flex-direction: row;
		gap: 10px;
		padding: 10px;
	}
	.players > div {
		border: 1px solid black;
		border-radius: 5px;
		padding: 5px;
	}
	.human {
		background-color: antiquewhite;
	}
	.computer {
		background-color: dimgray;
		color: white;
	}
</style>
