### Stacking context issues
There is a 'Hand' component which takes an array of strings denoting playing card values ( 3 of clubs = '3c', Jack of hearts = 'h11', etc).  The {#each} directive is used to render the array as a series of 'Card' components, each of which interpret a string prop to render a playing card face, translating the suit ('h'=&#x2665; , 'd'=&#x2666;, 's'=&#x2660;, 'c'=&#x2663;) into the suit symbol, and the number into the appropriate number of said symbols.  Part of the design of these cards, is that they are readable with either end upright, so half of the symbols and letters or numbers are rotated, using the following css

```css
.rotated-symbol {
	transform: rotateZ(180deg);
}
```
The 'Hand' component markdown:

```html
<div class="hand-display">
	{#each cards as card (card)}
		<div class={`card-container ${isSelected}`} on:click={handleCardClick}>
			<CardFront cardValue={card} />
		</div>
	{/each}
</div>
```
The hand-display class defines a grid that displays cards overlapping each other, with each cell of the grid being a fraction of the card width, as follows:
```css
	.hand-display {
		display: grid;
		grid-template-columns: repeat(13, calc(var(--card-width) * 0.4));
	}
```
At this point in my development, I encountered some tricky behavior of css stacking contexts.  This behavior is consistent both for html compiled from Svelte components and for vanilla html/css.

What I see in Svelte is that the elements of the 'CardFront' component which are transformed end up in their own stacking-context. Un-transformed elements are properly overlapping in the order specified by the 'cards' array.  Transformed elements are also proper overlapping in order, but they are not overlapped by any un-transformed elements.

This is counter-intuitive to me, in that I expect any elements that are children of component to be walled off in their own stacking context.  Any changes to stacking order caused by css I would expect to be limited to that context (not the case).  

I was able to fix this issue by applying the following to the enclosing div of each card
```css
.card-container {
	transform: rotateZ(0deg); 
}
```
Apparently this does nothing to the element other than to put it in the same stacking context as other, legitemately transformed elements.  The application of any other css property that triggers such evaluation also does the trick, such as 
```css
.card-container {
	opacity: 0.999;		//invisible change.  setting opacity to 1 does not work.
}
```


### Await block issues
My Hearts game is implemented as a multiplayer game, allowing for multiple human players to play the same game in real-time.  Gameplay logic runs on an ExpressJS server, which stores the game state as a structured JSON document in mongoDB.  The frontend uses custom Svelte store implementation.  All coordination with the backend runs through methods in the store implementation, so that Svelte components need only deal with the Store.  Svelte stores provide a subscription to a 'reactive' variable, such that any markup with these 'reactive' variable dependencies automagically re-renders when the values change.

Since the store is synced with the database, updates are asynchronous, and so the store sometimes serves unresolved promises.  As such, to directly use the store values in markup, they need to be wrapped in an {#await} block.  

However, the await block, when resolved, removes the child element from the DOM and re-inserts it, which means css transitions are not rendered.  

Instead, I use a standard variable declared with the 'let' keyword, and reassign the variable using the await keyword, all within the 
```html 
	<script> 
``` 
area.  Elements rendered using this variable are kept updated, but are not removed and re-inserted into the DOM.

### Async Store issues
Publish a REPL showing a continuously updating gameState provider