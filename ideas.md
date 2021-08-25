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
