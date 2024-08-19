<script lang="ts">
	import type { PageServerData } from './$types';
	export let data: PageServerData;
	$: ({ get_pregress_notes, get_departments, get_staffs, get_form_documents } = data);
	import { globalLoading, inerHight } from '$lib/store';
	import DeleteModal from '$lib/components/etc/DeleteModal.svelte';
	import { enhance } from '$app/forms';
	let progress_note_id = 0;
	let editEtiology = false;
	let editDepartment = false;
	let editDoctor = false;
</script>

<DeleteModal action="?/delete_progress_note" id={progress_note_id} />
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
		<h2>IPD</h2>
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
					><i class="nav-icon fas fa-procedures"></i>
					Patient IPD
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
				<table class="table table-bordered">
					<thead class="sticky-top bg-light table-active">
						<tr class="text-center">
							<th style="width: 5%; ">ID</th>
							<th>Dates</th>
							<th>Patient</th>
							<th>Etiology</th>
							<th>Department</th>
							<th>Doctor</th>
							<th>Room</th>
							<th>Doc</th>
							<th>Visit</th>
							<th>Payment</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody class="table-sm">
						{#each get_pregress_notes as item}
							<tr class="text-center">
								<td>{item.id}</td>
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
								<td>
									<a href="/ipd/{item.id}/progress-note">
										<span class="">
											{item.patient?.name_khmer}
										</span>
										<br />
										<span class="badge text-bg-primary">
											{item.patient?.name_latin}
										</span>
									</a>
								</td>

								<td>
									{#if editEtiology && item.id === progress_note_id}
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
											class="btn"
											on:click={() => {
												editEtiology = true;
												editDepartment = false;
												editDoctor = false;
												progress_note_id = item.id;
											}}>{item.etiology ?? ''}</button
										>
									{/if}
								</td>
								<td>
									{#if editDepartment && progress_note_id === item.id}
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
											class="btn"
											on:click={(e) => {
												if (e.target) editDepartment = true;
												editEtiology = false;
												editDoctor = false;
												progress_note_id = item.id;
											}}>{item.department?.department ?? ''}</button
										>
									{/if}
								</td>
								<td>
									{#if editDoctor && progress_note_id === item.id}
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
											class="btn"
											on:click={() => {
												editDepartment = false;
												editEtiology = false;
												editDoctor = true;
												progress_note_id = item.id;
											}}>{item.staff?.name ?? ''}</button
										>
									{/if}
								</td>

								<td>
									<span class="badge text-bg-success">{item.bed?.room?.room ?? ''}</span><br />
									<span class="badge text-bg-success"
										>{item.bed?.room?.product?.products ?? ''}</span
									>
								</td>
								<td></td>
								<td
									><div>
										<a class="btn btn-secondary btn-sm" href="/{item.id}/subjective"
											><i class="fas fa-share-square"></i></a
										>
									</div></td
								>
								<td></td>
								<td>
									<div>
										<button
											on:click={() => {
												progress_note_id = 0;
												progress_note_id = item.id;
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
