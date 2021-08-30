<script>
</script>

<div class="card-back">
	<div></div>
</div>

<style>
	.card-back {
		font-size: calc(var(--card-width) * 0.15);
		height: var(--card-height);
		background: var(--cardback-background);
		border-radius: var(--card-border-radius);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		--border-offset: 0.5;
		padding: calc(var( --card-border-radius) * var(--border-offset));
	}
	.card-back div {
		width: 100%;
		height: 100%;
		border: 1px solid black;
		border-radius: calc( var(--card-border-radius) * var(border-offset))

	}
</style>
