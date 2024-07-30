<script lang="ts">
	import SubmitButton from '$lib/components/etc/SubmitButton.svelte';
	import { onDestroy, onMount } from 'svelte';
	import type { PageServerData } from './$types';
	import { enhance } from '$app/forms';
	import { browser } from '$app/environment';
	import Select from '$lib/components/etc/Select.svelte';
	let loading = false;
	export let data: PageServerData;
	$: ({ get_staffs, get_patient, get_departments } = data);
	let date_checkup = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
</script>

<div class="row">
	<div class="col-sm-6">
		<h2 class="">New Visit IPD</h2>
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
			<li class="breadcrumb-item">
				<a href={'#'} class="btn btn-link p-0 text-secondary"
					><i class=" fas fa-procedures"></i>
					IPD
				</a>
			</li>
		</ol>
	</div>
</div>

<div class="card">
	<div class="card-header bg-info">
		<h4 class="card-title">
			<span>#{get_patient?.name_khmer}, </span>
			<span>{get_patient?.name_latin} </span>
		</h4>
	</div>
	<form
		method="post"
		action="?/create_visit_ipd"
		class="form-horizontal"
		use:enhance={() => {
			loading = true;
			return async ({ update, result }) => {
				await update();
				loading = false;
			};
		}}
	>
		<input class="form-control" value={date_checkup} type="hidden" name="date_checkup" />
		<input value={get_patient?.id} type="hidden" name="patient_id" />
		<div class="card-body">
			<div class="form-group row pb-3">
				<label for="etiology" class="col-sm-2 col-form-label">Etiology</label>
				<div class="col-sm-10">
					<input name="etiology" type="text" class="form-control" id="etiology" />
				</div>
			</div>
			<div class="form-group row pb-3">
				<label for="staff" class="col-sm-2 col-form-label">Staff</label>
				<div class="col-sm-10">
					<Select name="staff_id" items={get_staffs.map((e) => ({ id: e.id, name: e.name }))} />
				</div>
			</div>
			<div class="form-group row pb-3">
				<label for="department_id" class="col-sm-2 col-form-label">Department</label>
				<div class="col-sm-10">
					<Select
						name="department_id"
						items={get_departments.map((e) => ({ id: e.id, name: e.department }))}
					/>
				</div>
			</div>
		</div>
		<div class="card-footer">
			<a href="/patient/all" class="btn btn-light"><i class="fas fa-undo"></i> Cancel</a>
			<div class="float-end">
				<SubmitButton />
			</div>
		</div>
	</form>
</div>
