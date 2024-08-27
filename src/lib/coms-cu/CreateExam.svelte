<script lang="ts">
	import type { ActionData, PageServerData } from '../../routes/(dash)/settup/physical-exam/$types';
	import { enhance } from '$app/forms';
	import { t } from '$lib/translations';
	import SubmitButton from '$lib/coms/SubmitButton.svelte';
	export let form: ActionData;
	export let data: PageServerData;
	export let exam_id: number;
	$: ({ get_examas } = data);
	$: find_exam = get_examas.find((e) => e.id === exam_id);

	let loading = false;
</script>

<!-- @_Add_MedicineType -->
<div class="modal fade" id="create-exam" data-bs-backdrop="static">
	<div class="modal-dialog modal-xl">
		<form
			action={find_exam?.id ? '?/update_exam' : '?/create_exam'}
			method="post"
			class="modal-content"
			use:enhance={() => {
				loading = true;
				return async ({ update, result }) => {
					await update();
					loading = false;
					if (result.type !== 'failure') {
						exam_id = 0;
						document.getElementById('close_create_exam')?.click();
					}
				};
			}}
		>
			<div class="modal-header">
				<h4 class="modal-title">Exam</h4>
				<button
					id="close_create_exam"
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
								<input value={find_exam?.id} type="hidden" name="examination_id" />
								<label for="exam">Name</label>
								<input
									value={find_exam?.examination ?? ''}
									name="examination"
									type="text"
									class="form-control"
									id="exam"
								/>
								{#if form?.examination}
									<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
								{/if}
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
