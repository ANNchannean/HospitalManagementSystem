<script lang="ts">
	import type { PageServerData } from './$types';
	import { enhance } from '$app/forms';
	import DeleteModal from '$lib/coms/DeleteModal.svelte';
	import SubmitButton from '$lib/coms/SubmitButton.svelte';
	import { globalLoading, inerHight } from '$lib/store';
	import ConfirmeModal from '$lib/coms/ConfirmeModal.svelte';
	import Renderhtml from '$lib/coms/Renderhtml.svelte';
	import DateTimeFormat from '$lib/coms/DateTimeFormat.svelte';
	export let data: PageServerData;
	let vaccin_id: number;
	let loading = false;
	$: ({ get_injection } = data);
	$: find_injection = get_injection.find((e) => e.id === vaccin_id);
	let appointment_injection_id: number;
</script>

<!-- svelte-ignore a11y-missing-attribute -->

<DeleteModal action="?/delete_appionment_inject" id={appointment_injection_id} />
<ConfirmeModal action="?/update_appointment_inject" id={appointment_injection_id} />
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
							<th>Patient ID</th>
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
								<td class="text-center">
									<DateTimeFormat timeStyle={false} date={item.datetime} />
									<br />
									<DateTimeFormat dateStyle={false} date={item.datetime} />
								</td>
								<td class="text-center">
									{item?.patient?.id}
								</td>
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
										<span class=" badge text-bg-info text-start">{item.unit?.unit ?? ''}</span>
										<br />
										{#each item.vaccine as iitem, index (iitem.id)}
											<span class=" badge text-bg-success text-start"
												>{'លើកទី 0'.concat(String(index + 1))} {iitem.product?.products ?? ''}</span
											> <br />
										{/each}
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
										>Schedule Vaccine
									</button>
									<div>
										{#each item.appointmentInjection as iitem}
											{#if iitem.times < 10}
												<span class="badge text-bg-warning">
													{'លើកទី 0'.concat(String(iitem?.times))}
													<DateTimeFormat timeStyle={false} date={iitem.appointment} />
												</span>
												{#if iitem.status}
													<button type="button" class="btn btn-link btn-lg"
														><i class="fa-solid fa-square-check"></i></button
													>
													{'បានចាក់​'}
													<DateTimeFormat date={iitem.datetime_inject} />
												{:else}
													<button type="button" class="btn btn-link btn-lg"
														><i class="fa-regular fa-square"></i></button
													>
												{/if}
												<br />
											{:else}
												<span class="badge text-bg-warning">
													{'លើកទី '.concat(String(iitem?.times))}
												</span>
												<br />
											{/if}
										{/each}
									</div>
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
				<h4 class="modal-title">Schedule Injection</h4>
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
								<option value="1">លើកទី ០១</option>
								<option value="2">លើកទី ០២</option>
								<option value="3">លើកទី ០៣</option>
								<option value="4">លើកទី ០៤</option>
								<option value="5">លើកទី ០៥</option>
								<option value="6">លើកទី ០៦</option>
								<option value="7">លើកទី ០៧</option>
								<option value="8">លើកទី ០៨</option>
								<option value="9">លើកទី ០៩</option>
								<option value="10">លើកទី ១០</option>
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
					{#if find_injection?.unit?.vaccine_dose}
						<Renderhtml value={find_injection?.unit?.vaccine_dose ?? ''} />
					{/if}
					<table class="table table-sm text-nowrap">
						<thead>
							<tr>
								<th colspan="5">
									{find_injection?.unit?.unit ?? ''}
								</th>
							</tr>
						</thead>
						<tbody>
							{#each find_injection?.appointmentInjection || [] as item, index (item.id)}
								<tr>
									<td>
										<button
											on:click={() => {
												appointment_injection_id = 0;
												appointment_injection_id = item.id;
											}}
											type="button"
											class="btn btn-danger"
											data-bs-toggle="modal"
											data-bs-target="#delete_modal"
											><i class="fa-solid fa-trash-can"></i>
										</button>
									</td>
									<td>
										{#if item.times < 10}
											{'លើកទី 0'.concat(String(item?.times))}
										{:else}
											{'លើកទី '.concat(String(item?.times))}
										{/if}
									</td>

									<td>
										{#if item.status}
											<button class="btn btn-primary">
												<DateTimeFormat timeStyle={false} date={item.appointment} />
											</button>
										{:else}
											<button class="btn btn-danger">
												<DateTimeFormat timeStyle={false} date={item.appointment} />
											</button>
										{/if}
									</td>
									<td>
										{#if item.status}
											<button
												on:click={() => {
													appointment_injection_id = 0;
													appointment_injection_id = item.id;
												}}
												data-bs-toggle="modal"
												data-bs-target="#confirme_modal"
												id="confirme_modal"
												type="button"
												class="btn btn-link btn-lg"><i class="fa-solid fa-square-check"></i></button
											>
										{:else}
											<button
												on:click={() => {
													appointment_injection_id = 0;
													appointment_injection_id = item.id;
												}}
												disabled={index + 1 > Number(find_injection?.vaccine.length)}
												data-bs-toggle="modal"
												data-bs-target="#confirme_modal"
												id="confirme_modal"
												type="button"
												class="btn btn-link btn-lg"><i class="fa-regular fa-square"></i></button
											>
										{/if}
									</td>
									{#if item.status}
										<td>
											<DateTimeFormat date={item.datetime_inject} />

											<!-- Vaccine {find_injection?.vaccine[index].product?.products ?? ''} -->
										</td>
									{:else}
										<td></td>
									{/if}
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>
