<script>
	import {Link} from 'svelte-routing'
	const currentDate = new Date();
</script>

<main>
	<h1>Hearts, by norrichs</h1>
	<h2>Lobby</h2>
	<p>{currentDate}</p>
	<Link to="/game/"><button>Play Game</button></Link>
</main>