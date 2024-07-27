<script lang="ts">
	import { enhance } from '$app/forms';
	import { dobToAge } from '$lib/helper';
	import { t } from '$lib/translations';
	import type {
		ActionData,
		PageServerData
	} from '../../../routes/(dash)/ipd/[progress_note_id]/progress-note/$types';
	import Select from '../Select.svelte';
	import SubmitButton from '../SubmitButton.svelte';
	export let data: PageServerData;
	$: ({ get_progress_note, get_staffs } = data);
	let loading = false;
</script>

<!-- @_Create Unit -->
<div class="modal fade" id="create_visit_ipd" data-bs-backdrop="static">
	<div class="modal-dialog modal-dialog-scrollabl modal-lg">
		<form
			action="?/create_visit_ipd"
			method="post"
			use:enhance={() => {
				loading = true;
				return async ({ update, result }) => {
					await update();
					loading = false;
					if (result.type !== 'failure') {
						document.getElementById('close_create_visit_ipd')?.click();
					}
				};
			}}
			class="modal-content"
		>
			<div class="modal-header">
				<h4 class="modal-title">New Progress Note</h4>
				<button
					id="close_create_visit_ipd"
					type="button"
					class="btn-close"
					data-bs-toggle="modal"
					data-bs-target="#create_prescription"
					data-bs-dismiss="modal"
					aria-label="Close"
				>
				</button>
			</div>
			<div class="modal-body pb-0">
				<div class="card-body border p-0">
					<table class="table text-nowrap table-responsive">
						<thead class="text-bold">
							<tr class="">
								<td>#Patient</td>
								<td> : </td>
								<td
									>{get_progress_note?.patient?.name_khmer},{get_progress_note?.patient
										?.name_latin ?? ''}</td
								>
								<td>#Gender</td>
								<td> : </td>

								<td>{get_progress_note?.patient?.gender ?? ''}</td>
							</tr>
							<tr class="">
								<td>#Phone</td>
								<td> : </td>
								<td>{get_progress_note?.patient?.telephone ?? ''}</td>
								<td>#Age</td>
								<td> : </td>

								<td>
									{dobToAge({
										d: new Date(get_progress_note?.patient?.dob ?? '').getDate(),
										m: new Date(get_progress_note?.patient?.dob ?? '').getMonth() + 1,
										y: new Date(get_progress_note?.patient?.dob ?? '').getFullYear(),
										date: new Date(get_progress_note?.date_checkup ?? '')
									}).y} ឆ្នាំ ,
									{dobToAge({
										d: new Date(get_progress_note?.patient?.dob ?? '').getDate(),
										m: new Date(get_progress_note?.patient?.dob ?? '').getMonth() + 1,
										y: new Date(get_progress_note?.patient?.dob ?? '').getFullYear(),
										date: new Date(get_progress_note?.date_checkup ?? '')
									}).m} ខែ ,
									{dobToAge({
										d: new Date(get_progress_note?.patient?.dob ?? '').getDate(),
										m: new Date(get_progress_note?.patient?.dob ?? '').getMonth() + 1,
										y: new Date(get_progress_note?.patient?.dob ?? '').getFullYear(),
										date: new Date(get_progress_note?.date_checkup ?? '')
									}).d} ថ្ងៃ
								</td>
							</tr>

							<!-- <tr>
								<td>#Request Check</td>
								<td> : </td>

								<td
									>{get_progress_note?.product?.products ??
										''}</td
								>
							</tr> -->
						</thead>
					</table>
				</div>

				<div class="pt-4 pb-2">
					<input value={get_progress_note?.patient_id} type="hidden" name="patient_id" />
					<div class="form-group row">
						<label for="staff" class="col-sm-2 col-form-label">Doctor</label>
						<div class="col-sm-10">
							<Select name="staff_id" items={get_staffs.map((e) => ({ id: e.id, name: e.name }))} />
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
