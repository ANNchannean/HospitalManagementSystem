<script lang="ts">
	import { fade } from 'svelte/transition';
	export let show = false;
	export let toas = 'infomation' as 'success' | 'infomation' | 'error';
	export let message = '';
	$: {
		if (show === true) {
			setTimeout(() => {
				show = false;
			}, 2500);
		}
	}
</script>

{#if show}
	<div
		in:fade={{ duration: 200 }}
		out:fade={{ duration: 200 }}
		class="toast-container position-fixed bottom-0 end-0 p-3"
	>
		<div
			class:text-bg-warning={toas === 'infomation'}
			class:text-bg-success={toas === 'success'}
			class:text-bg-danger={toas === 'error'}
			class="toast align-items-center position-absolute sticky-top show mt-2"
			role="alert"
			aria-live="assertive"
			aria-atomic="true"
		>
			<div class="d-flex">
				<div class="toast-body">
					{#if toas === 'infomation'}
						<i class="fa-solid fa-circle-exclamation"></i>
					{/if}
					{#if toas === 'error'}
						<i class="fa-solid fa-triangle-exclamation"></i>
					{/if}
					{#if toas === 'success'}
						<i class="fa-solid fa-circle-check"></i>
					{/if}
					{message}
				</div>
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
