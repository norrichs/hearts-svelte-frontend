<script>
	import { Router, Route, Link } from "svelte-routing";
	import Splash from './pages/Splash.svelte'
	import Lobby from "./pages/Lobby.svelte";
	import Game from "./pages/Game.svelte";
	import Signin from "./pages/Signin.svelte"
	import {} from "svelte/easing";
	// import SandBox from "./pages/SandBox.svelte";


</script>

<Router >
	<Route path="/"><Splash /></Route>
	<Route path="/signin/"><Signin /></Route>
	<Route path="/lobby/"><Lobby /></Route>
	<Route path="/game/"><Game /></Route>
	<!-- <Route path="/sandbox/"><SandBox /></Route> -->
</Router>

<style>
	:global(:root) {
		/* dimensions */
		--card-ratio: 0.7;
		--card-height: 150px;
		--card-width: calc(var(--card-height) * var(--card-ratio));
		--card-border-radius: calc(var(--card-height) / 15);
		/* colors */
		--cardfront-background: rgb(231, 231, 230);
		--cardback-background: radial-gradient(
			circle,
			rgba(70, 163, 57, 1) 0%,
			rgba(15, 91, 17, 1) 100%
		);
		--redsuit-color: rgb(143, 2, 2);
		--blacksuit-color: rgb(0, 10, 3);
		--select-distance: -0.4;
		--select-speed: 450ms;
		--select-scale: 1;
		--select-rotation: 0deg;
		--header-height: 100px;
		--card-overlap-reveal: 0.2;
		--trick-card-scale: 1;
		--npc-scale: 0.6;
	}
</style>
