<script lang="ts">
	import type { PageServerData } from '../../routes/(dash)/ipd/[progress_note_id]/nursing-process/$types';
	import { enhance } from '$app/forms';
	import SubmitButton from '$lib/coms/SubmitButton.svelte';
	export let data: PageServerData;
	export let nursing_process_id: number;
	$: ({ get_nursing_process } = data);
	$: find_nursing_process = get_nursing_process.find((e) => e.id === nursing_process_id);
	let loading = false;
</script>

<!-- @_Add_ParameterGrop -->
<div class="modal fade" id="create_nursing_process" data-bs-backdrop="static">
	<div class="modal-dialog modal-xl">
		<form
			action="?/create_nursing_process"
			method="post"
			class="modal-content"
			use:enhance={() => {
				loading = true;
				return async ({ update, result }) => {
					await update({ reset: false });
					loading = false;
					if (result.type !== 'failure') {
						document.getElementById('close_nursing_process')?.click();
					}
				};
			}}
		>
			<input type="hidden" value={nursing_process_id || ''} name="nursing_process_id" />
			<div class="modal-header">
				<h4 class="modal-title">Nursing Process</h4>
				<button
					on:click={() => (nursing_process_id = 0)}
					id="close_nursing_process"
					type="button"
					class="btn-close"
					data-bs-dismiss="modal"
					aria-label="Close"
				>
				</button>
			</div>
			<div class="modal-body">
				<div class="card-body pt-0">
					{#if nursing_process_id}
						<input value={find_nursing_process?.datetime || ''} type="hidden" name="date" />
						<div class="form-group row pb-3">
							<label for="time" class="col-sm-3 col-form-label">Time</label>

							<div class="col-sm-9">
								<div class="input-group">
									<input
										value={find_nursing_process?.datetime?.slice(11, 16)}
										id="time"
										name="time"
										type="time"
										class="form-control"
									/>
								</div>
							</div>
						</div>
					{/if}
					<div class="form-group row pb-3">
						<label for="accessment" class="col-sm-3 col-form-label">Accessment</label>
						<div class="col-sm-9">
							<div class="input-group">
								<textarea
									value={find_nursing_process?.accessment ?? ''}
									id="accessment"
									name="accessment"
									rows="4"
									class="form-control"
								/>
							</div>
						</div>
					</div>
					<div class="form-group row pb-3">
						<label for="health_problems" class="col-sm-3 col-form-label">Health Problems</label>
						<div class="col-sm-9">
							<div class="input-group">
								<textarea
									value={find_nursing_process?.health_problems ?? ''}
									id="health_problems"
									name="health_problems"
									rows="4"
									class="form-control"
								/>
							</div>
						</div>
					</div>
					<div class="form-group row pb-3">
						<label for="actions" class="col-sm-3 col-form-label">Actions</label>
						<div class="col-sm-9">
							<div class="input-group">
								<textarea
									value={find_nursing_process?.actions ?? ''}
									id="actions"
									name="actions"
									rows="4"
									class="form-control"
								/>
							</div>
						</div>
					</div>

					<div class="form-group row pb-3">
						<label for="evolution" class="col-sm-3 col-form-label">Evolution</label>
						<div class="col-sm-9">
							<div class="input-group">
								<textarea
									value={find_nursing_process?.evolution ?? ''}
									id="evolution"
									name="evolution"
									rows="4"
									class="form-control"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer justify-content-end">
				<SubmitButton {loading} />
			</div>
		</form>
	</div>
</div>
