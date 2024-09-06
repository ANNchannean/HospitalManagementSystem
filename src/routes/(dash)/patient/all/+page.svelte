<script lang="ts">
	import type { ActionData, PageServerData } from './$types';
	import DeleteModal from '$lib/coms/DeleteModal.svelte';
	import CreatePatient from '$lib/coms-cu/CreatePatient.svelte';
	import { inerHight } from '$lib/store';
	import VIewProfilePatient from '$lib/coms/VIewProfilePatient.svelte';
	import { dobToAge } from '$lib/helper';
	import DateTimeFormat from '$lib/coms/DateTimeFormat.svelte';
	export let form: ActionData;
	export let data: PageServerData;
	$: ({ get_patients, get_province } = data);
	$: find_patient = get_patients.filter((e) => e.id === patient_id);
	let patient_id: number;
	let province_id: number;
	let district_id: number;
	let commune_id: number;
	let village_id: number;
	let age: number = 0;
	let dob: string = '';
</script>

<VIewProfilePatient
	bind:patient_id
	data={{
		get_patients: find_patient
	}}
/>
<DeleteModal action="?/delete_patient" id={find_patient[0]?.id} />
<CreatePatient
	data={{
		get_province: get_province,
		get_patients: find_patient
	}}
	{form}
	bind:patient_id
	bind:province_id
	bind:district_id
	bind:commune_id
	bind:village_id
	bind:age
	bind:dob
/>
<!-- @_Visite_Modal -->
<div class="modal fade" id="modal-visite">
	<div class="modal-dialog modal-dialog-centered modal-sm">
		<input
			id="close_visit_modal"
			class="hide"
			data-bs-dismiss="modal"
			aria-label="Close"
			type="hidden"
		/>

		<div class="modal-content">
			<div class="modal-header">
				<a
					href="/opd?patient_id={find_patient[0]?.id}"
					on:click={() => document.getElementById('close_visit_modal')?.click()}
					class="btn btn-success btn-lg"
					><i class=" fas fa-stethoscope fa-4x"> </i> <br /> <span>OPD</span></a
				> <br />

				<a
					href="/ipd?patient_id={find_patient[0]?.id}"
					on:click={() => document.getElementById('close_visit_modal')?.click()}
					class="btn btn-danger btn-lg"
					><i class=" fas fa-procedures fa-4x"> </i> <br /> <span>IPD</span></a
				> <br />
			</div>
		</div>
	</div>
</div>

<div class="row">
	<div class="col-sm-6">
		<h2 class="">Patient</h2>
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
					><i class="fas fa-restroom"></i>
					All Patient
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
				<div class=" row">
					<div class="col">
						<div class="input-group">
							<input
								type="text"
								name="table_search"
								class="form-control float-right"
								placeholder="Search"
							/>
						</div>
					</div>
					<div class="col-auto">
						<button
							on:click={() => {
								patient_id = 0;
								dob = '';
								age = 0;
								province_id = 0;
								district_id = 0;
								commune_id = 0;
								village_id = 0;
							}}
							type="button"
							class="btn btn-success"
							data-bs-toggle="modal"
							data-bs-target="#create-patient"
							><i class="fa-solid fa-square-plus"></i>
							Add Patient
						</button>
					</div>
				</div>
			</div>
			<div style="max-height: {$inerHight};" class="card-body table-responsive p-0">
				<table class="table table-hover table-bordered">
					<thead class="sticky-top bg-light table-active">
						<tr>
							<th class="text-center">ID</th>
							<th>Picture</th>
							<th>Patient Name</th>
							<th>Gender</th>
							<th>DOB</th>
							<th>Age</th>
							<th>Address</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{#each get_patients as item}
							<tr>
								<td class="text-center">{item.id}</td>
								<td class="text-center">
									<img
										src={item.fileOrPicture?.filename
											? `/files/${item.fileOrPicture?.filename}`
											: '/no-image.jpg'}
										alt=""
										height="30"
										class=""
									/>
								</td>
								<td>{item.name_khmer} <br /> {item.name_latin}</td>
								<td>{item.gender}</td>
								<td>
									<DateTimeFormat timeStyle={false} date={item.dob} />
								</td>
								<td>{dobToAge({ date: new Date().toJSON(), dob: item.dob }).y ?? ''} years </td>
								<td>
									{item.village?.type ?? ''}
									{item.village?.name_khmer.concat(',') ?? ''}
									{item.commune?.type ?? ''}
									{item.commune?.name_khmer.concat(',') ?? ''}
									{item.district?.type ?? ''}
									{item.district?.name_khmer.concat(',') ?? ''}
									{item.provice?.type ?? ''}
									{item.provice?.name_khmer ?? ''}
								</td>
								<td>
									<div>
										<button
											on:click={() => {
												patient_id = item.id;
											}}
											type="button"
											class="btn btn-secondary btn-sm"
											data-bs-toggle="modal"
											data-bs-target="#view-patient"
											><i class="fa-solid fa-expand"></i>
										</button>
										<button
											on:click={() => {
												patient_id = item.id;
											}}
											type="button"
											class="btn btn-success btn-sm"
											data-bs-toggle="modal"
											data-bs-target="#modal-visite"
											><i class="fa-solid fa-circle-plus"></i>
										</button>
										<button
											on:click={() => {
												patient_id = item.id;
												province_id = Number(item.province_id);
												district_id = Number(item.district_id);
												commune_id = Number(item.commune_id);
												village_id = Number(item.village_id);
												age = Number(item.age);
												dob = item.dob;
											}}
											type="button"
											class="btn btn-primary btn-sm"
											data-bs-toggle="modal"
											data-bs-target="#create-patient"
											><i class="fa-solid fa-file-pen"></i>
										</button>

										<button
											on:click={() => {
												patient_id = item.id;
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
