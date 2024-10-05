<script lang="ts">
	import { _ } from '$lib/translations';
	export let loading: boolean;
	export let action = '';
	export let id = 'myid';
	let className;
	export { className as class };
</script>

<button type="button" data-bs-toggle="modal" data-bs-target={`#${id}`} class={className}>
	<slot />
</button>

<div class="modal fade" tabindex="-1" role="dialog" {id} data-bs-backdrop="static">
	<div class="modal-dialog modal-sm" role="document">
		<div class="modal-content rounded-3 shadow">
			<div class="modal-body p-4 text-center">
				<h5 class="mb-0">{$_('confirm_yes')}</h5>
			</div>
			<div class="modal-footer flex-nowrap p-0">
				<button
					id="close_confirm_submit"
					type="button"
					class="btn btn-lg btn-link fs-6 text-decoration-none col-6 py-3 m-0 rounded-0 border-end"
					data-bs-dismiss="modal">{$_('no')}</button
				>
				{#if action}
					<button
						data-bs-dismiss="modal"
						formaction={action}
						type="submit"
						class="btn btn-lg btn-link fs-6 text-decoration-none text-danger col-6 py-3 m-0 rounded-0"
					>
						<strong>{$_('yes')}</strong>
					</button>
				{/if}
				{#if !action}
					<button
						data-bs-dismiss="modal"
						disabled={loading}
						type="submit"
						class="btn btn-lg btn-link fs-6 text-decoration-none text-danger col-6 py-3 m-0 rounded-0"
					>
						<strong>{$_('yes')}</strong>
					</button>
				{/if}
			</div>
		</div>
	</div>
</div>
