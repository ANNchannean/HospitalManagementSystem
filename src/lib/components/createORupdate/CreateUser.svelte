<script lang="ts">
	import type { PageServerData } from '../../../routes/(dash)/user/$types';
	import { enhance } from '$app/forms';
	import SubmitButton from '../etc/SubmitButton.svelte';
	import Select from '../etc/Select.svelte';
	export let data: PageServerData;
	export let user_id: string;
	let staff_id: number;
	$: ({ get_users, get_staffs } = data);
	$: find_user = get_users.find((e) => e.id === user_id);
	let loading = false;
</script>

<!-- @_Add_ParameterGrop -->
<div class="modal fade" id="create_user" data-bs-backdrop="static">
	<div class="modal-dialog modal-xl">
		<form
			action={find_user?.id ? '?/update_user' : '?/create_user'}
			method="post"
			class="modal-content"
			use:enhance={() => {
				loading = true;
				return async ({ update, result }) => {
					await update();
					loading = false;
					if (result.type !== 'failure') {
						user_id = '';
						document.getElementById('close_create_user')?.click();
					}
				};
			}}
		>
			<div class="modal-header">
				<h4 class="modal-title">User</h4>
				<button
					id="close_create_user"
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
								<label for="role">Staff</label>
								<Select
									name="staff_id"
									bind:value={staff_id}
									items={get_staffs.map((e) => ({ id: e.id, name: e.name }))}
								/>
							</div>
						</div>
						<div class="col-12">
							<input value={find_user?.id || ''} type="hidden" name="user_id" />
							<div class="form-group pb-3">
								<label for="username">User name</label>

								<input
									value={find_user?.username ||
										get_staffs.find((e) => e.id === staff_id)?.name ||
										''}
									name="username"
									type="text"
									class="form-control"
									id="username"
								/>
							</div>
						</div>
						{#if !user_id}
							<div class="col-12">
								<div class="form-group pb-3">
									<label for="Password">Password</label>
									<input name="password" type="text" class="form-control" id="Password" />
								</div>
							</div>
						{/if}

						<div class="col-12">
							<div class="form-group pb-3">
								<label for="role">Role</label>
								<select value={find_user?.role ?? ''} class="form-control" name="role" id="role">
									<option value="ADMIN">ADMIN</option>
									<option value="DOCTOR">DOCTOR</option>
									<option value="PHARMACIST">PHARMACIST</option>
									<option value="NURSE">NURSE</option>
									<option value="LABO_TECHICAL">LABO_TECHICAL</option>
									<option value="RADIOGRAPHY">RADIOGRAPHY</option>
								</select>
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
