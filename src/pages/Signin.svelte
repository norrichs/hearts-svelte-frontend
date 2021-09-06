<script>
	import { onMount } from "svelte";
	import { played, url, userParams } from "../stores.js";
	import {navigate} from 'svelte-routing'
	let username;
	let plaintextPassword;
	let signInStatus = null;
	const saltRounds = 10;

	// REFACTOR
	// 	Send plaintext password and username to the server route /users/check/, where it will be encoded and compared, returning a status
	//		New username returns 'new'
	//		Failed match returns 'failed'
	//		Positive match returns 'passed' and userParam data
	// IF status === 'new'
	//		DIALOGUE - 'Looks like new signin - USE NEW or TRY AGAIN'
	// 		IF USE NEW
	//			send plain text again to server route /users/newUser/
	//		ELSE
	//			reset username and plainTextPassword
	//			return to sign-in dialogue
	//

	const handleSignIn = async () => {
		console.log("handle Sign in");
		// send username and password to server
		// if username is not found, confirm new user
		// if username is found, check password validity
		// if password is valid, navigate to Lobby with Store values set
		if (username.length > 0 && plaintextPassword.length > 0) {
			const resp = await fetch(`${url}/user/check/${username}/${plaintextPassword}`);
			const data = await resp.json();
			signInStatus = data.message;
			console.log("signin status", signInStatus, "data", data);
			if (signInStatus === "passed") {
				$userParams = data.data;
				navigate("/lobby", {replace: false})
			} else if (signInStatus === "new") {
				if (confirm("new username.  create as user and login?")) {
					console.log('creating new user')
					const resp = await fetch(`${url}/user/newUser/${username}/${plaintextPassword}`);
					const data = await resp.json();
					console.log('new user params data', data.data)
					$userParams = data.data
					console.log('just set userParams', $userParams)
					navigate("/lobby", {replace: false})
				}
			} else {
				alert("incorrect password!");
			}
		}
	};
</script>

<main>
	<section>
		<h2>Sign In</h2>
		<input type="text" placeholder="username" bind:value={username} />
		<input
			type="password"
			placeholder="password"
			bind:value={plaintextPassword}
		/>
		<button
			on:click={async () => {
				await handleSignIn();
			}}>Sign in</button
		>
		<aside>
			Don't use a real password here... Not secure... I'm not trying to
			steal your real passwords...
		</aside>
	</section>
</main>

<style>
	main {
		display: grid;
		place-items: center;
		background-color: dimgrey;
		width: 100%;
		height: 100%;
	}
	section {
		background-color: white;
		max-width: 500px;
		padding: 40px;
		border-radius: 5px;
		box-shadow: 0 0 20px 0px black;
	}
	button,
	input {
		width: 100%;
	}
	aside {
		font-size: 0.75em;
	}
</style>
