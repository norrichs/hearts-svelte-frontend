<script>
	import { Link } from "svelte-routing";
	const currentDate = new Date();
</script>

<main>
	<section>
		<h1>Hearts, by norrichs</h1>
		<h2>Lobby</h2>
		<ul>
			<li>Under construction.</li>
			<li>
				Game is currently configured to run in single-player mode, with 3
				computer opponents.
			</li>
			<li>Opponents play with a 'random valid card' strategy.</li>
		</ul>
		<h2>Coming soon...</h2>
		<ul>
			<li>Multi-player mode with opponent matching</li>
			<li>Configurable game parameters (win score, animation speed, etc)</li>
		</ul>
		<h2>More info</h2>
		<ul>
			<li><a href="https://github.com/norrichs/hearts-game">Backend Github</a></li>
			<li><a href="https://github.com/norrichs/hearts-svelte-frontend">Frontend Github</a></li>
			<li><a href="https://norrichs.com">My Portfolio</a></li>
		</ul>
		<Link to="/signin/"><button>Join a Game</button></Link>
	</section>
</main>

<style>
	main{
		display: grid;
		place-items: center;
		background-color: dimgrey;
		width: 100%;
		height: 100%;
	}
	section{
		background-color: white;;
		max-width: 500px;
		padding: 40px;
		border-radius: 5px;
		box-shadow: 0 0 20px 0px black;
	}
	button{
		width: 100%;
	}
</style>