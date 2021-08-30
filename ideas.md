## Ideas for architecture of hearts game
- use recursive game loop?
	```js
	const gameLoop = () => {
		gameState = requestAnimationFrame(gameLoop)
	}
	```
- use custom store with functions to handle database calls?
- use separate js file to handle db actions
- use class directive for selections
```html
	<div class='card-container' class:{}>
		<CardFront />
	</div>
```
- use derived stores to spread gameState components (if necessary?)


### Game Cycle 
1. In lobby
	a) list of waiting games, each with a join and start button, and display of current user composition (humans and computers)
	b) new game join and start
	c) if join is clicked, and there are computer players, continue waiting
	d) if start is clicked, start a new game w/ those players
	e) if join is clicked and all players are human, start a new game w/ those players
2. Game start
	a) Link to frontend/game route
	b) If user was final player, then initialize new game on backend server/seed, then server/deal => gameState
	c) If user was not final player, would need to be listening for start signal from server (lobby wait loop)
3. Game
	a)gameLoop
		i) 


### Game Cycle refactor
1.  Express server contains all game logic
2.  Routes include:
	- start
	- select
	- pass
	- play
3.  Router functions are minimal.  Minimal data sent as args.
4.  All router functions pass to heatsLib central game router
5.  Central game router uses current gameState and user action to navigate decision tree and trigger game actions, returning a new gameState, which is also updated to DB
6.  Database is _simply_ synced to store.  Use a readable store.  Store sync method has a timing parameter in gameState Object that specifies frequency, so that it is adjustable.
7.  Frontend state has _single_ source of truth, which is gameState store.  Only do this if a working prototype can be developed that avoids any refresh() type methods.  Just use in-built store reactivity and resolve promises in-store


Game Decision Tree

	IF phase === start
		newGame()  	// newGame() deals to json, then seeds
		prepPasses()		// prepPasses() checks how to pass based on gameState, does computer passes
	ELSE IF phase === newHand
		newHand(gameId) 	// newHand() deals to json, then updates
		prepPasses()

		// After a hand is dealt and computer player passes have been set, waiting for player input
	ELSE IF phase === 'pass'
		IF action === select
			select('toPass')
		ELSE IF action === 'pass'
			passCards()		// passCards exchanges selections between hands


function pass()
	IF 