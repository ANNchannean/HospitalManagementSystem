<script lang="ts">
	export let src = '';
	export let link = '';

	let container;
	let placeholder;
</script>

<div bind:this={container}>
	<picture>
		{#if link && !src}
			<img
				fetchpriority="high"
				decoding="async"
				role="presentation"
				loading="lazy"
				src="/files/{link}"
				alt="preview"
			/>
		{/if}
		{#if src && !link}
			<img loading="lazy" {src} alt="preview" />
		{/if}
		{#if !src && !link}
			<span bind:this={placeholder}>Image Preview</span>
		{/if}
		{#if src && link}
			<img loading="lazy" {src} alt="preview" />
		{/if}
	</picture>
</div>

<style>
	div {
		width: 200px;
		height: 200px;
		border: 2px solid #ddd;
		/* margin-top: 15px; */
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		color: #ccc;
	}
	img {
		max-width: 100%;
		max-height: 100%;
	}
</style>
