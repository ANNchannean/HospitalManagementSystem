<script lang="ts">
	import type { PageServerData } from './$types';
	import { enhance } from '$app/forms';
	import DeleteModal from '$lib/components/etc/DeleteModal.svelte';
	import SubmitButton from '$lib/components/etc/SubmitButton.svelte';
	import { globalLoading, inerHight } from '$lib/store';
	import { t } from '$lib/translations';
	import ConfirmeModal from '$lib/components/etc/ConfirmeModal.svelte';
	export let data: PageServerData;
	let vaccin_id: number;
	let loading = false;
	$: ({ get_injection } = data);
	$: find_injection = get_injection.find((e) => e.id === vaccin_id);
	let appointment_injection_id: number;
	let new_appionment = false;
	const timesInject = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
</script>

<button
	data-bs-toggle="modal"
	data-bs-target="#confirme_modal"
	id="confirme_modal"
	type="button"
	class="d-none"
>
</button>
<!-- <DeleteModal action="?/delete_vaccine" /> -->
<ConfirmeModal action="?/update_action" id={appointment_injection_id} />
<div class="row">
	<div class="col-sm-6">
		<h2>List Vaccine</h2>
	</div>
	<div class="col-sm-6">
		<ol class="breadcrumb justify-content-end">
			<li class="breadcrumb-item">
				<a href="/dashboard" class="btn btn-link p-0 text-secondary"
					><i class="fas fa-tachometer-alt"></i>
					Home
				</a>
			</li>
			<li class="breadcrumb-item">
				<a href="/vaccine" class="btn btn-link p-0 text-secondary"
					><i class="fas fa-syringe nav-icon"></i>
					Vaccine
				</a>
			</li>
		</ol>
	</div>
</div>

<div class="row">
	<div class="col-12">
		<div class="card">
			<div class="card-header">
				<div class="row">
					<div class="col">
						<input
							type="text"
							name="table_search"
							class="form-control float-right"
							placeholder="Search"
						/>
					</div>
				</div>
			</div>
			<div style="max-height: {$inerHight};" class="card-body table-responsive p-0">
				<table class="table table-bordered">
					<thead class="table-active table-light sticky-top">
						<tr>
							<th class="text-center" style="width: 5%;">ID</th>
							<th class="text-center">Date</th>
							<th>Patient Name</th>
							<th class="text-center">Gender</th>
							<th class="text-center">Age</th>
							<th>Doctor</th>
							<!-- <th>Visit Type</th> -->
							<th>Vaccine</th>
							<th class="text-center">Schedule</th>

							<th></th>
						</tr>
					</thead>
					<tbody>
						{#each get_injection as item}
							<tr>
								<td class="text-center">{item.id}</td>
								<td
									>{new Date(item?.datetime ?? '')
										.toJSON()
										.slice(0, 10)
										.split('-')
										.reverse()
										.join('-')}
									<br />
									{new Date(item?.datetime ?? '').toLocaleTimeString('en-GB', {
										hour12: true,
										timeStyle: 'short'
									})}</td
								>
								<td>
									{item?.patient?.name_khmer} <br />
									{item?.patient?.name_latin}
								</td>
								<td class="text-center">{item?.patient?.gender}</td>
								<td class="text-center">{item?.patient?.age}</td>
								<!-- <td>{item?.staff?.name}</td> -->
								<!-- <td>{item?.checkin_type}</td> -->
								<td></td>
								<td>
									<div>
										<span class=" badge text-bg-info text-start"
											>{item.product?.products ?? ''}</span
										>
										<br />
									</div>
								</td>
								<td>
									<button
										on:click={() => {
											vaccin_id = 0;
											vaccin_id = item.id;
										}}
										data-bs-toggle="modal"
										data-bs-target="#create_injection"
										type="button"
										class="btn btn-sm btn-info"
										>Inject {item.vaccine.length}
									</button>
								</td>
								<td>
									<div>
										<button style="background-color: deeppink;" type="button" class="btn btn-sm"
											>Invoice
										</button>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>

<!-- @Create Ijection -->
<div class="modal fade" id="create_injection" data-bs-backdrop="static">
	<div class="modal-dialog modal-dialog-scrollabl modal-xl">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title">Create Document</h4>
				<button
					data-bs-toggle="modal"
					data-bs-target="#create_injection"
					id="nest_create_injection"
					type="button"
					class="d-none"
				>
				</button>
				<button
					id="close_create_injection"
					type="button"
					class="btn-close"
					data-bs-dismiss="modal"
					aria-label="Close"
				>
				</button>
			</div>
			<div class="modal-body">
				<div>
					<form
						use:enhance={() => {
							loading = true;
							$globalLoading = true;
							return async ({ update }) => {
								await update();
								loading = false;
								$globalLoading = false;
							};
						}}
						action="?/create_appointment_inject"
						method="post"
					>
						<input type="hidden" name="injection_id" value={find_injection?.id ?? ''} />
						<div class="form-group mb-3">
							<label for="times">Times</label>
							<select class="form-control" name="times" id="times">
								<option value="លើកទី ០១">លើកទី ០១</option>
								<option value="លើកទី ០២">លើកទី ០២</option>
								<option value="លើកទី ០៣">លើកទី ០៣</option>
								<option value="លើកទី ០៤">លើកទី ០៤</option>
								<option value="លើកទី ០៥">លើកទី ០៥</option>
								<option value="លើកទី ០៦">លើកទី ០៦</option>
								<option value="លើកទី ០៧">លើកទី ០៧</option>
								<option value="លើកទី ០៨">លើកទី ០៨</option>
								<option value="លើកទី ០៩">លើកទី ០៩</option>
								<option value="លើកទី ១០">លើកទី ១០</option>
							</select>
						</div>
						<div class="form-group mb-3">
							<label for="appointment">Appointment</label>
							<input class="form-control" type="date" name="appointment" id="appointment" />
						</div>
						<div class="form-group">
							<label for="discription">Discription</label>
							<textarea rows="3" class="form-control" name="discription" id="discription"
							></textarea>
						</div>
						<div class=" col pt-3 justify-content-end text-end">
							<SubmitButton {loading} />
						</div>
					</form>
				</div>
				<hr />
				<div class="card-body table-responsive p-0">
					<table class="table text-nowrap">
						<tbody>
							{#each find_injection?.appointmentInjection || [] as item}
								<tr>
									<td style="width: 5%;">{item.times ?? ''}</td>
									<td style="width: 5%;">{$t('common.date')}</td>
									<td style="width: 20%;">
										{#if item.status}
											<button class="btn btn-primary">
												{new Intl.DateTimeFormat('en-GB', {
													dateStyle: 'short',
													hour12: true
												}).format(new Date(item.appointment))}
											</button>
										{:else}
											<button class="btn btn-danger">
												{new Intl.DateTimeFormat('en-GB', {
													dateStyle: 'short',
													hour12: true
												}).format(new Date(item.appointment))}
											</button>
										{/if}
									</td>
									<td>
										<input
											on:change={() => {
												appointment_injection_id = 0;
												appointment_injection_id = item.id;
												document.getElementById('confirme_modal')?.click()
											}}
											checked={item.status}
											type="checkbox"
											name=""
											class="form-check-input"
											id=""
										/>
									</td>
									{#if item.status}
										<td
											>{new Intl.DateTimeFormat('en-GB', {
												dateStyle: 'short',
												hour12: true
											}).format(new Date(item.datetime_inject ?? new Date()))}</td
										>
									{/if}
									<td> </td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>
