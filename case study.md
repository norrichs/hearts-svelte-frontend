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
However, setting o

&#x1F494;
&#x2764;
&#x2349;