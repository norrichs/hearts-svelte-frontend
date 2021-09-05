<script>
	import { url, userParams, user} from "../stores.js";
	import { onMount } from "svelte";
	import { Link, navigate } from "svelte-routing";

	let gamesList = null;
	let joined = false;
	let showModal = false;
	let joinedGameId = null;
	let isMultiplayer = false;

	const startSinglePlayer = () => {};

	const handleClickPlayer = (gameId, user) => {
		const game = gamesList[gamesList.map(g=>g._id).indexOf(gameId)]

		console.log(game.players.map(p=>p.playerType))
		if(game.players.map(p=>p.playerType).includes('human')){
			isMultiplayer = true;
		}
		// If already joined game...
		// Need a different model to deal with assigning unique user id's to people...
		

		$userParams.gameId = gameId
		$userParams.playerNumber = user
		showModal = true;
	}

	const handleAddToGame = async (gameId, name, user) => {
		await fetch(`${url}/gameState/updateGameState/${gameId}/${user}/${name}/${isMultiplayer ? user : 'x'}`)
		gamesList = await refreshGamesList();
		showModal = false;
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
		let confirmed = confirm("Really end all in-progress games?");
		if (confirmed) {
			const resp = await fetch(`${url}/gameState/clear`);
			gamesList = await refreshGamesList();
		}
	};

	const handleStartGame = async (gameId) => {
		$userParams.gameId = gameId
		console.log('starting game', gameId, 'userParams gameId', $userParams.gameId)
		// const resp = await fetch(`${url}/gameState/getState/${gameId}`)
		// const data = await resp.json()
		
		// $gS = data.data
		// console.log('got game', $gS)
		navigate("/game")

	}
	onMount(async () => {
		console.log("lobby mounted, user", $userParams)
		gamesList = await refreshGamesList();

	});
</script>

<main>
	
	<section class='modal-background' class:showModal>
		<div class='modal'>
			<h2>Create your player to join</h2>
			<div>{$user + "-" + $userParams.gameId}</div>
			{#if !isMultiplayer}
				<button>Start the game!</button>
			{:else}
				<div>Multiplayer</div>
			{/if}
			<button on:click={()=>{
				handleAddToGame($userParams.gameId ,$user, $userParams.playerNumber)
				showModal = false;
			}}>Wait for more players</button>
			
			
		</div>	
	</section>


	<header>
		<h1>Lobby</h1>
		<h1>Logged in as: {$user}</h1>
	</header>


	<section>
		<h2>Games</h2>
		<button on:click={handleClear}>End All Games</button>
		<button on:click={fetchNewGame}>Add game</button>
		<button on:click={startSinglePlayer}>Start Single Player Game</button>
		<ul class="game-listing">
			{#if gamesList !== null}
				{#each gamesList as game}
					<li class="listed-game">
						<div class="players" class:open={game.phase === "open"}>
							{#each game.players as p,i}
								<div
									class={p.playerType}
									on:click={() => {handleClickPlayer(game._id, i)}}
								>
									{p.name}
								</div>
							{/each}
						</div>
						<button on:click={()=>handleStartGame(game._id)}
							>Start!</button
						>
					</li>
				{/each}
			{:else}
				<li>waiting</li>
			{/if}
		</ul>
	</section>
</main>

<style>
	.main{
		position: relative;
	}
	.game-listing {
		max-width: 600px;
	}
	.listed-game {
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
	.computer:hover {
		transform: scale(1.1);
		transition: 1s;
	}
	.modal-background{
		visibility: hidden;
		position: absolute;
		display: grid;
		place-items: center;
		background-color: dimgrey;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
	}
	.modal{
		background-color: white;;
		max-width: 500px;
		padding: 40px;
		border-radius: 5px;
		box-shadow: 0 0 20px 0px black;
	}
	.showModal{
		visibility: visible
	}
</style>
