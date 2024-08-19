<script lang="ts">
	import { enhance } from '$app/forms';
	import CreateDocument from '$lib/components/createORupdate/CreateDocument.svelte';
	import ConfirmeModal from '$lib/components/etc/ConfirmeModal.svelte';
	import DeleteModal from '$lib/components/etc/DeleteModal.svelte';
	import { globalLoading, inerHight } from '$lib/store';
	import type { PageServerData } from './$types';
	export let data: PageServerData;
	$: ({ get_visits, get_departments, get_staffs } = data);
	let editEtiology = false;
	let editDepartment = false;
	let editDoctor = false;
	let visit_id = 0;
	let billing_id = 0;
</script>

<DeleteModal action="?/delete_visit" id={visit_id} />
<CreateDocument {data} {visit_id} />
<ConfirmeModal action="?/process_billing" id={billing_id} />
<div class="modal fade" id="modal-visite">
	<div class="modal-dialog modal-dialog-centered modal-sm">
		<div class="modal-content">
			<div class="modal-header">
				<button type="submit" class="btn btn-success btn-lg p-4"
					><i class=" fas fa-stethoscope fa-3x"></i></button
				>
				<button type="submit" class="btn btn-danger btn-lg p-4"
					><i class=" fas fa-procedures fa-3x"></i></button
				>
			</div>
		</div>
	</div>
</div>

<div class="row">
	<div class="col-sm-6">
		<h2>OPD</h2>
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
				<a href="/patient/all" class="btn btn-link p-0 text-secondary"
					><i class="nav-icon fas fa-stethoscope"></i>
					Patient OPD
				</a>
			</li>
		</ol>
	</div>
</div>
<div class="row">
	<div class="col-12">
		<div class="card">
			<div class="card-header">
				<!-- <h3 class="card-title">Fixed Header Table</h3> -->
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
				<table class="table table-hover text-nowrap table-valign-middle table-bordered">
					<thead class="sticky-top bg-light table-active">
						<tr class="text-center">
							<th style="width: 3%;">ID</th>
							<th style="width: 7%;">Dates</th>
							<th style="width: 5%;">Patient ID</th>
							<th style="width: 10%;">Patient</th>
							<th style="width: 15%;">Etiology</th>
							<th style="width: 20%;">Department</th>
							<th style="width: 10%;">Doctor</th>
							<th style="width: 10%;">Doc</th>
							<th style="width: 5%;">Visit</th>
							<th style="width: 5%;">Pay</th>
							<th style="width: 7%;">Transfer to IPD</th>
							<th></th>
						</tr>
					</thead>
					<tbody class="table-sm">
						{#each get_visits as item (item.id)}
							<tr class="text-center">
								<td class="text-left">{item.id}</td>
								<td
									>{new Intl.DateTimeFormat('en-GB', { dateStyle: 'short' })
										.format(new Date(item.date_checkup ?? ''))
										.split('/')
										.join('-')} <br />
									{new Intl.DateTimeFormat('en-GB', {
										timeStyle: 'short',
										hour12: true
									}).format(new Date(item.date_checkup ?? ''))}
								</td>
								<td>{item.patient_id ?? ''}</td>
								<td>
									{#if item.transfer}
										<button class="btn btn-link opacity-75">
											<span>
												{item.patient?.name_khmer}
											</span>
											<br />
											<span class="badge text-bg-primary">
												{item.patient?.name_latin}
											</span>
										</button>
									{:else}
										<a href="/opd/{item.id}/subjective">
											<span>
												{item.patient?.name_khmer}
											</span>
											<br />
											<span class="badge text-bg-primary">
												{item.patient?.name_latin}
											</span>
										</a>
									{/if}
								</td>
								<td>
									{#if editEtiology && item.id === visit_id}
										<form
											data-sveltekit-keepfocus
											use:enhance={() => {
												$globalLoading = true;
												return async ({ update }) => {
													await update({ reset: false });
													$globalLoading = false;
													editDepartment = false;
													editEtiology = false;
													editDoctor = false;
												};
											}}
											method="post"
											action="?/update_etiology"
											on:change={(e) => {
												e.currentTarget.requestSubmit();
												editEtiology = false;
											}}
										>
											<input
												name="etiology"
												class="bg-info form-control text-center"
												value={item.etiology}
												type="text"
											/>
											<input type="hidden" name="id" value={item.id} />
										</form>
									{:else}
										<button
											disabled={item.transfer}
											class="btn btn-link text-decoration-none text-dark"
											on:click={() => {
												editEtiology = true;
												editDepartment = false;
												editDoctor = false;
												visit_id = item.id;
											}}>{item.etiology ?? ''}</button
										>
									{/if}
								</td>
								<td>
									{#if editDepartment && visit_id === item.id}
										<form
											data-sveltekit-keepfocus
											use:enhance={() => {
												$globalLoading = true;
												return async ({ update }) => {
													await update({ reset: false });
													editDepartment = false;
													editEtiology = false;
													editDoctor = false;
													$globalLoading = false;
												};
											}}
											method="post"
											action="?/update_department"
											on:change={(e) => {
												e.currentTarget.requestSubmit();
												editDepartment = false;
											}}
										>
											<select
												class="form-control text-center bg-info"
												name="department_id"
												id="department_id"
											>
												{#each get_departments as iitem}
													<option selected={item.department_id === iitem.id} value={iitem.id}
														>{iitem.department}</option
													>
												{/each}
											</select>
											<input type="hidden" name="id" value={item.id} />
										</form>
									{:else}
										<button
											disabled={item.transfer}
											class="btn btn-link text-decoration-none text-dark"
											on:click={(e) => {
												if (e.target) editDepartment = true;
												editEtiology = false;
												editDoctor = false;
												visit_id = item.id;
											}}>{item.department?.department ?? ''}</button
										>
									{/if}
								</td>
								<td>
									{#if editDoctor && visit_id === item.id}
										<form
											data-sveltekit-keepfocus
											use:enhance={() => {
												$globalLoading = true;
												return async ({ update }) => {
													await update({ reset: false });
													editDepartment = false;
													editEtiology = false;
													editDoctor = false;
													$globalLoading = false;
												};
											}}
											method="post"
											action="?/update_staff"
											on:change={(e) => {
												e.currentTarget.requestSubmit();
												editDepartment = false;
												editDoctor = false;
												editEtiology = false;
											}}
										>
											<select
												class="form-control text-center bg-info"
												name="staff_id"
												id="staff_id"
											>
												{#each get_staffs as iitem}
													<option selected={item.staff_id === iitem.id} value={iitem.id}
														>{iitem.name}</option
													>
												{/each}
											</select>
											<input type="hidden" name="id" value={item.id} />
										</form>
									{:else}
										<button
											disabled={item.transfer}
											class="btn btn-link text-decoration-none text-dark"
											on:click={() => {
												editDepartment = false;
												editEtiology = false;
												editDoctor = true;
												visit_id = item.id;
											}}>{item.staff?.name ?? ''}</button
										>
									{/if}
								</td>
								<td>
									<button
										on:click={() => {
											visit_id = 0;
											visit_id = Number(item?.id);
										}}
										data-bs-toggle="modal"
										data-bs-target="#create_document"
										type="button"
										class="btn btn-primary position-relative"
									>
										Document
										{#if item.document.length}
											<span
												class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
											>
												{item.document.length}
												<span class="visually-hidden">unread messages</span>
											</span>
										{/if}
									</button>
								</td>
								<td>
									{item.checkin_type ?? ''}
								</td>
								<td>
									{#if item.billing?.status === 'active'}
										<button
											type="button"
											on:click={() => {
												billing_id = 0;
												billing_id = Number(item?.billing?.id);
											}}
											data-bs-toggle="modal"
											data-bs-target="#confirme_modal"
											class="btn btn-primary btn-sm">Active</button
										>
									{:else}
										<button
											on:click={() => {
												billing_id = 0;
												billing_id = Number(item?.billing?.id);
											}}
											type="button"
											data-bs-toggle="modal"
											data-bs-target="#confirme_modal"
											class="btn btn-danger btn-sm">DeActive</button
										>
									{/if}
								</td>
								<td>
									<div>
										{#if item.transfer}
											<button type="button" class="btn btn-danger btn-sm">Admitted to IPD</button>
										{:else}
											<a
												href="/ipd?patient_id={item.patient_id}&visit_id={item.id}"
												class="btn btn-light btn-sm">Transfer to IPD</a
											>
										{/if}
									</div>
								</td>
								<td>
									<div>
										<button
											disabled={item.transfer}
											on:click={() => {
												visit_id = 0;
												visit_id = item.id;
											}}
											type="button"
											class="btn btn-danger btn-sm"
											data-bs-toggle="modal"
											data-bs-target="#delete_modal"
											><i class="fa-solid fa-trash-can"></i>
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
