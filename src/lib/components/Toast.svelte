<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	let offTaos = true;
	export let message = '';
	onMount(() => {
		setTimeout(() => {
			offTaos = false;
		}, 2000);
	});
</script>

{#if offTaos}
	<div
		in:fade={{ duration: 300 }}
		out:fade={{ duration: 300 }}
		class="position-relative justify-content-end d-flex"
	>
		<div
			class="toast align-items-center position-absolute show text-bg-warning"
			role="alert"
			aria-live="assertive"
			aria-atomic="true"
		>
			<div class="d-flex">
				<div class="toast-body"><i class="fa-solid fa-bell"></i> {message}</div>
				<button
					type="button"
					class="btn-close me-2 m-auto"
					data-bs-dismiss="toast"
					aria-label="Close"
				></button>
			</div>
		</div>
	</div>
{/if}
