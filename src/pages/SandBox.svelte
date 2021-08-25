<script>
	import { Link } from "svelte-routing";
	import CardFront from "../components/CardFront.svelte";
	import HandDisplay from "../components/HandDisplay.svelte";

	let testCard = "c10";
	let cards = ["s9", "h13"];
	let message = 'h10'
</script>

<main>
	<section class="sandbox">
		<h1>Sandbox</h1>
		<input bind:value={message} placeholder="message">

		<div>
			<HandDisplay {message} cards={[{id:'h12', selected: false}]}/>
		</div>
	</section>
</main>

<style>

</style>
