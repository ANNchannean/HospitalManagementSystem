<script lang="ts">
	import type { PageServerData } from '../../routes/(dash)/settup/physical-exam/$types';
	import { enhance } from '$app/forms';
	import SubmitButton from '../coms/SubmitButton.svelte';
	export let data: PageServerData;
	export let exam_id: number;
	$: ({ get_examas } = data);
	$: find_exam = get_examas.find((e) => e.id === exam_id);

	let loading = false;
</script>

<!-- @_Add_MedicineType -->
<div class="modal fade" id="update-physical" data-bs-backdrop="static">
	<div class="modal-dialog modal-xl">
		<form
			action="?/update_physical"
			method="post"
			class="modal-content"
			use:enhance={() => {
				loading = true;
				return async ({ update, result }) => {
					await update();
					loading = false;
					if (result.type !== 'failure') {
						exam_id = 0;
						document.getElementById('close_update_physical')?.click();
					}
				};
			}}
		>
			<div class="modal-header">
				<h4 class="modal-title">Physical</h4>
				<button
					id="close_update_physical"
					type="button"
					class="btn-close"
					data-bs-dismiss="modal"
					aria-label="Close"
				>
				</button>
			</div>
			<div class="modal-body">
				<div class="card-body pt-0">
					<div class="row">
						{#each find_exam?.physical || [] as item}
							<div class="col-10">
								<div class="form-group pb-3">
									<input type="hidden" name="id" value={item.id} />
									<input
										value={item.physical ?? ''}
										name="physical_name"
										type="text"
										class="form-control"
										id="physical_name"
									/>
									<!-- {#if form?.examination}
                                        <p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
                                        {/if} -->
								</div>
							</div>
							<div class="col-2">
								<form use:enhance action="?/delete_physical" method="post">
									<input type="hidden" name="id" value={item?.id ?? ''} />
									<button class="btn btn-danger btn" type="submit"
										><i class="fa-solid fa-trash-can"></i></button
									>
								</form>
							</div>
						{/each}
					</div>
				</div>
			</div>
			<div class="modal-footer justify-content-end">
				<SubmitButton {loading} />
			</div>
		</form>
	</div>
</div>
