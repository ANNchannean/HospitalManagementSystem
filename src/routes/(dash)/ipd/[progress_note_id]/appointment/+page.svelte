<script lang="ts">
	import { enhance } from '$app/forms';
	import DeleteModal from '$lib/coms/DeleteModal.svelte';
	import SubmitButton from '$lib/coms/SubmitButton.svelte';
	import type { PageServerData } from './$types';
	export let data: PageServerData;
	$: ({ get_appointment } = data);
	$: date = Intl.DateTimeFormat('en-GB', { dateStyle: 'short' })
		.format(new Date(get_appointment?.date ?? new Date()))
		.split('/')
		.reverse()
		.join('-');
	let loading = false;
</script>

<DeleteModal action="?/delete_appointment" id={get_appointment?.id} />
<div class="card">
	<div class="card-header fs-4">
		<span># Appointment</span>
	</div>
	<form
		use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				await update();
				loading = false;
			};
		}}
		action="?/create_appointment"
		method="post"
		class="form-horizontal"
	>
		<div class="card-body">
			<div class="row">
				<div class="col-sm-4 p-2">
					<div class="form-group row mx-2">
						<label for="date" class="form-label">Date</label>
						<div class="input-group">
							<input value={date} id="date" name="date" type="date" class="form-control" />
						</div>
						<label for="description" class="form-label">Description</label>
						<div class="input-group">
							<textarea
								value={get_appointment?.description ?? ''}
								id="description"
								name="description"
								rows="6"
								class="form-control"
							/>
						</div>
					</div>
					<div class="float-end p-4">
						<SubmitButton {loading} />
					</div>
				</div>
				<div class="col-sm-8 p-2">
					<div class=" table-sm table-responsive">
						<table class="table table-head-fixed table-hover text-nowrap table-valign-middle">
							<thead class="">
								<tr>
									<th>Date</th>
									<th>Description</th>
									<th></th>
								</tr>
							</thead>
							<tbody class="table-sm">
								{#if get_appointment}
									<tr>
										<td style="width: 20%;"
											>{get_appointment?.date
												? Intl.DateTimeFormat('en-GB', { dateStyle: 'short' }).format(
														new Date(get_appointment?.date ?? new Date())
													)
												: ''}</td
										>
										<td>{get_appointment?.description ?? ''}</td>
										<td style="width: 10%;">
											<div>
												<a
													href={'#'}
													type="button"
													class="btn btn-danger btn-sm"
													data-bs-toggle="modal"
													data-bs-target="#delete_modal"
													><i class="fa-solid fa-trash-can"></i>
												</a>
											</div>
										</td>
									</tr>
								{/if}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</form>
</div>
