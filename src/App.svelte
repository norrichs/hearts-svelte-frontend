<script>
	import { Router, Route, Link } from "svelte-routing";
	import Lobby from "./pages/Lobby.svelte";
	import Game from "./pages/Game.svelte";
	import {} from 'svelte/easing'
	// import SandBox from "./pages/SandBox.svelte";

	export let url = "";
	const dbUrl = "http://localhost:4500";
	const user = 0;

</script>

<Router {url}>
	<!-- <header>
		<nav>
			<div>test</div>
			<Link to="/">Lobby</Link>
			<Link to="/game/">Game test</Link>
			<Link to="/sandbox/">Sandbox</Link>
		</nav>
	</header> -->
	<div>
		<Route path="/"><Lobby /></Route>
		<Route path="/game/"><Game {dbUrl} {user} /></Route>
		<!-- <Route path="/sandbox/"><SandBox /></Route> -->
	</div>
</Router>

<style>
	:global(:root) {
		/* dimensions */
		--card-ratio: 0.7;
		--card-height: 150px;
		--card-width: calc(var(--card-height) * var(--card-ratio));
		--card-border-radius: calc( var(--card-height) / 15);
		/* colors */
		--cardfront-background: rgb(231, 231, 230);
		--cardback-background: radial-gradient(circle, rgba(70,163,57,1) 0%, rgba(15,91,17,1) 100%);
		--redsuit-color: rgb(143, 2, 2);
		--blacksuit-color: rgb(0, 10, 3);
		--select-distance: -0.4;
		--select-speed: 450ms;
		--select-scale: 1.0;
		--select-rotation: 0deg;
		--header-height: 100px;
		--card-overlap-reveal: 0.15;
		--npc-scale: 0.6;
	}
	/* header{
		height: var(--header-height)
	}
	nav {
		border: 1px solid magenta;
	} */
</style>
