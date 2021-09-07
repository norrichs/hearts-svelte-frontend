<script>
	import { url, userParams, user} from "../stores.js";
	import { onMount } from "svelte";
	import { Link, navigate } from "svelte-routing";

	let gamesList = null;
	let joined = false;
	let showModal = false;
	let joinedGameId = null;
	let isMultiplayer = false;
	let clickedPlayerType = null;
	let clickedGameId = null;
	let clickedPlayerNumber = null;

	const startSinglePlayer = () => {};

	const handleClickPlayer = (gameId, clickedPlayer) => {
		const game = gamesList[gamesList.map((g) => g._id).indexOf(gameId)];
		clickedPlayerNumber = clickedPlayer;
		clickedPlayerType = game.players[clickedPlayer].playerType;
		clickedGameId = gameId;

		console.log(game.players.map((p) => p.playerType));
		if (game.players.map((p) => p.playerType).includes("human")) {
			isMultiplayer = true;
		}
		$userParams.gameId = gameId;
		$userParams.playerNumber = clickedPlayer;
		showModal = true;
	};
	const handleSwitchModal = () => {
		console.log("showModal state", showModal);
		showModal = showModal ? false : true;
	};

	const handleAddToGame = async (gameId, name, user) => {
		await fetch(
			`${url}/gameState/updateGameState/${gameId}/${user}/${name}/${
				isMultiplayer ? "x" : user
			}`
		);
		gamesList = await refreshGamesList();
		showModal = false;
	};
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
	const handleEndGame = async (gameId) => {
		if(confirm("End this game?")){
			const resp = await fetch(`${url}/gameState/delete/${gameId}`)
			gamesList = await refreshGamesList();
		}
	}
	const handleStartGame = async (gameId) => {
		// Check if user already added. If not, add and update DB


		$userParams.gameId = gameId;
		const game = gamesList[gamesList.map(g=>g._id).indexOf(gameId)]
		if(!game.players.map(p=>p.name).includes($userParams.username)){
			game.players[clickedPlayerNumber].name = $userParams.username
			game.players[clickedPlayerNumber].playerType = 'human'
			// await gS.syncState(game)
			await fetch(
			`${url}/gameState/updateGameState/${gameId}/${clickedPlayerNumber}/${$userParams.username}/${clickedPlayerNumber}`
		);
		}
		console.log(
			"starting game",
			gameId,
			"userParams gameId",
			$userParams.gameId
		);

		navigate("/game");
	};
	onMount(async () => {
		console.log("lobby mounted, user", $userParams);
		gamesList = await refreshGamesList();
	});
</script>

<main>
	<section class="modal-background" class:showModal>
		{#if clickedPlayerType === "computer" && gamesList.map(g=>g._id).includes(clickedGameId)}
			<div class="modal">
				<h2>Clicked game spot</h2>
				<p>
					Player '{gamesList[
						gamesList.map((g) => g._id).indexOf(clickedGameId)
					].players[clickedPlayerNumber].name}' is a computer.
				</p>
				<p>Take their spot?</p>
				<!-- <p>{isMultiplayer}</p> -->
				{#if !isMultiplayer}
					<p>You can start this game now or Join to wait for more humans.</p>
					<button on:click={handleStartGame(clickedGameId)}>Start the game!</button>
				{:else}
					<p>
						Join now to wait for the primary human player to start
						the game
					</p>
				{/if}
				<button
					on:click={() => {
						handleAddToGame(
							$userParams.gameId,
							$user,
							$userParams.playerNumber
						);
						showModal = false;
					}}>Join</button
				>
				<button on:click={handleSwitchModal}>Cancel</button>
			</div>
		{:else if clickedPlayerType === "human"}
			<div class="modal">
				<h2>
					{gamesList[
						gamesList.map((g) => g._id).indexOf(clickedGameId)
					].players[clickedPlayerNumber].name}
				</h2>
				<p>
					This player is already a human. Choose a spot occupied by a
					computer.
				</p>
				<button on:click={handleSwitchModal}>OK</button>
			</div>
		{/if}
	</section>

	<header>
		<h1>Lobby</h1>
		<h1>Logged in as: {$user}</h1>
	</header>

	<section>
		<h2>Games</h2>
		<!-- <button on:click={handleClear}>End All Games</button> -->
		<button on:click={fetchNewGame}>Add game</button>
		<!-- <button on:click={startSinglePlayer}>Start Single Player Game</button> -->
		<ul class="game-listing">
			{#if gamesList !== null}
				{#each gamesList as game}
					<li class="listed-game">
						<div class="players" class:open={game.phase === "open"}>
							{#if game.players[game.mainUser].name === $userParams.username}
							<button on:click={()=>{handleEndGame(game._id)}}>X</button>
							{/if}
							{#each game.players as p, i}
								<div
									class={p.playerType}
									class:main-user={game.mainUser === i}
									on:click={() => {
										handleClickPlayer(game._id, i);
									}}
								>
									{p.name}
								</div>
							{/each}
						</div>
						<!-- {game.mainUser} -->
						{#if game.players[game.mainUser].name === $userParams.username}
							<button on:click={() => handleStartGame(game._id)}>
								Start!
							</button>
						{:else}
							Waiting on primary player...
						{/if}
					</li>
				{/each}
			{:else}
				<li>waiting</li>
			{/if}
		</ul>
	</section>
</main>

<style>
	.main {
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
	.players > div.main-user{
		border: 4px solid black;
	}
	.computer {
		background-color: dimgray;
		color: white;
	}
	.computer:hover {
		transform: scale(1.1);
		transition: 1s;
	}
	.modal-background {
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
	.modal {
		background-color: white;
		max-width: 500px;
		padding: 40px;
		border-radius: 5px;
		box-shadow: 0 0 20px 0px black;
	}
	.showModal {
		visibility: visible;
	}
</style>
