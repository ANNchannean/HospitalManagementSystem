<script lang="ts">
	import type { ActionData, PageServerData } from '../../../routes/(dash)/staff/$types';
	import { enhance } from '$app/forms';
	import SubmitButton from '../etc/SubmitButton.svelte';
	import { t } from '$lib/translations';
	export let form: ActionData;
	export let data: PageServerData;
	export let staff_id: number;
	$: ({ get_staffs } = data);
	$: find_staff = get_staffs.find((e) => e.id === staff_id);
	let loading = false;
</script>

<!-- @_Add_ParameterGrop -->
<div class="modal fade" id="create_staff" data-bs-backdrop="static">
	<div class="modal-dialog modal-xl">
		<form
			action={find_staff?.id ? '?/update_staff' : '?/create_staff'}
			method="post"
			class="modal-content"
			use:enhance={() => {
				loading = true;
				return async ({ update, result }) => {
					await update();
					loading = false;
					if (result.type !== 'failure') {
						staff_id = 0;
						document.getElementById('close_create_staff')?.click();
					}
				};
			}}
		>
			<div class="modal-header">
				<h4 class="modal-title">Staff</h4>
				<button
					id="close_create_staff"
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
								<input value={find_staff?.id} type="hidden" name="staff_id" />
								<label for="name">Staff name</label>
								<input
									value={find_staff?.name ?? ''}
									name="name"
									type="text"
									class="form-control"
									id="name"
								/>
								{#if form?.name}
									<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
								{/if}
							</div>
						</div>
						<div class="col-12">
							<div class="form-group pb-3">
								<label for="gender">Gender</label>

								<select
									value={find_staff?.gender ?? ''}
									id="gender"
									class="form-control"
									name="gender"
								>
									<option value="">None</option>
									<option value="Male">Male</option>
									<option value="Female">Female</option>
								</select>
								{#if form?.gender}
									<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
								{/if}
							</div>
						</div>
						<div class="col-12">
							<div class="form-group pb-3">
								<label for="staff_type">StaffType</label>
								<select
									value={find_staff?.staff_type ?? ''}
									class="form-control"
									name="staff_type"
									id="staff_type"
								>
									<option value="ADMIN">ADMIN</option>
									<option value="DOCTOR">DOCTOR</option>
									<option value="PHARMACIST">PHARMACIST</option>
									<option value="NURSE">NURSE</option>
									<option value="LABO_TECHICAL">LABO_TECHICAL</option>
									<option value="RADIOGRAPHY">RADIOGRAPHY</option>
								</select>
							</div>
						</div>
						<div class="col-12">
							<div class="form-group pb-3">
								<label for="specific">Specific</label>
								<input
									value={find_staff?.specific ?? ''}
									name="specific"
									type="text"
									class="form-control"
									id="specific"
								/>
								{#if form?.specific}
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
