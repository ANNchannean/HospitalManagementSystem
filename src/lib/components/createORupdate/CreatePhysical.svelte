<script lang="ts">
	import type {
		ActionData,
		PageServerData
	} from '../../../routes/(dash)/settup/physical-exam/$types';
	import { enhance } from '$app/forms';
	import SubmitButton from '../etc/SubmitButton.svelte';
	import { t } from '$lib/translations';
	export let data: PageServerData;
	export let exam_id: number;
	$: ({ get_examas } = data);
	$: find_exam = get_examas.find((e) => e.id === exam_id);
	let loading = false;
</script>

<!-- @_Add_MedicineType -->
<div class="modal fade" id="create-physical" data-bs-backdrop="static">
	<div class="modal-dialog modal-xl">
		<form
			action="?/create_physical"
			method="post"
			class="modal-content"
			use:enhance={() => {
				loading = true;
				return async ({ update, result }) => {
					await update();
					loading = false;
					if (result.type !== 'failure') {
						exam_id = 0.1;
						document.getElementById('close_create_physical')?.click();
					}
				};
			}}
		>
			<div class="modal-header">
				<h4 class="modal-title">Physical</h4>
				<button
					id="close_create_physical"
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
						<div class="col-12">
							<div class="form-group pb-3">
								<input value={find_exam?.id} type="hidden" name="exam_id" />
								<label for="physical_name">Physical Name</label>
								<input name="physical_name" type="text" class="form-control" id="physical_name" />
								<!-- {#if form?.examination}
									<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
								{/if} -->
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
