<script lang="ts">
	import SubmitButton from '$lib/components/etc/SubmitButton.svelte';
	import type { PageServerData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import Select from '$lib/components/etc/Select.svelte';
	import Toast from '$lib/components/etc/Toast.svelte';
	let loading = false;
	export let data: PageServerData;
	export let form: ActionData;
	$: ({ get_staffs, get_patient, get_departments } = data);
	let height = 0;
	let weight = 0;
	let asign_vitalsign = true;
	let bmi = {
		number: 0,
		string: '',
		color: ''
	};
	$: height_m_to_cm = (height / 100) * (height / 100);
	$: {
		if (weight / height_m_to_cm < 16) {
			bmi.string = 'Severely Underweight';
			bmi.color = '#F9E61A';
		}
		if (weight / height_m_to_cm > 16.0 && weight / height_m_to_cm < 18.4) {
			bmi.string = 'Underweight';
			bmi.color = '#E4D10C';
		}
		if (weight / height_m_to_cm > 18.5 && weight / height_m_to_cm < 24.9) {
			bmi.string = 'Normal';
			bmi.color = '#06C506';
		}
		if (weight / height_m_to_cm > 25.0 && weight / height_m_to_cm < 29.9) {
			bmi.string = 'Overweight';
			bmi.color = '#C7760C';
		}
		if (weight / height_m_to_cm > 30.0 && weight / height_m_to_cm < 34.9) {
			bmi.string = 'Moderately Obesity';
			bmi.color = '#D44A10';
		}
		if (weight / height_m_to_cm > 35.0 && weight / height_m_to_cm < 50) {
			bmi.string = 'Severly Obesity';
			bmi.color = '#EC0404';
		}
		bmi.number = weight / height_m_to_cm;
	}
</script>

{#if form?.visit_id}
	<Toast message="កាបញ្ជូលព័តមានមិនត្រឹមត្រូវ!" />
{/if}
<div class="row">
	<div class="col-sm-6">
		<h2 class="">New Visit OPD</h2>
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
					><i class=" fas fa-stethoscope"></i>
					OPD
				</a>
			</li>
		</ol>
	</div>
</div>

<div class="card">
	<div class="card-header">
		<h4 class="card-title">
			<span>#{get_patient?.name_khmer}, </span>
			<span>{get_patient?.name_latin} </span>
		</h4>
	</div>

	<form
		method="post"
		action="?/create_visit_opd"
		class="form-horizontal"
		use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				await update();
				loading = false;
			};
		}}
	>
		<input value={get_patient?.id} type="hidden" name="patient_id" />
		<input type="hidden" name="bmi" value={bmi?.number.toFixed(1) || ''} />
		<div class="card-body">
			<div class="">
				<div class="form-group row pb-3">
					<label for="etiology" class="col-sm-3 col-form-label">Etiology</label>
					<div class="col-sm-9">
						<input name="etiology" type="text" class="form-control" id="etiology" />
					</div>
				</div>
				<div class="form-group row pb-3">
					<label for="staff" class="col-sm-3 col-form-label">Staff</label>
					<div class="col-sm-9">
						<Select name="staff_id" items={get_staffs.map((e) => ({ id: e.id, name: e.name }))} />
					</div>
				</div>
				<div class="form-group row pb-3">
					<label for="ddepartment_idoctor" class="col-sm-3 col-form-label">Department</label>
					<div class="col-sm-9">
						<Select
							name="department_id"
							items={get_departments.map((e) => ({ id: e.id, name: e.department }))}
						/>
					</div>
				</div>
			</div>
			<div class="form-check">
				<input
					bind:checked={asign_vitalsign}
					class="form-check-input"
					type="checkbox"
					name="asign_vitalsing"
					id="flexCheckDefault"
				/>
				<label class="form-check-label" for="flexCheckDefault">Accept vitalsign</label>
			</div>
			<hr />
			{#if asign_vitalsign}
				<div class="">
					<div class="form-group row pb-3">
						<label for="bp" class="col-sm-3 col-form-label">BP (mmHg)</label>
						<div class="col-sm-9">
							<div class="row">
								<div class="col-sm-6">
									<div class="input-group">
										<input
											id="sbp"
											placeholder="Systolic"
											name="sbp"
											type="number"
											step="any"
											class="form-control"
										/>
									</div>
								</div>
								<div class="col-sm-6">
									<div class="input-group">
										<input
											id="dbp"
											placeholder="Diastolic"
											name="dbp"
											type="number"
											step="any"
											class="form-control"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="form-group row pb-3">
						<label for="pulse" class="col-sm-3 col-form-label">Pulse (min)</label>
						<div class="col-sm-9">
							<div class="input-group">
								<input id="pulse" name="pulse" type="number" step="any" class="form-control" />
							</div>
						</div>
					</div>
					<div class="form-group row pb-3">
						<label for="t" class="col-sm-3 col-form-label">T (C)</label>
						<div class="col-sm-9">
							<div class="input-group">
								<input id="t" name="t" type="number" step="any" class="form-control" />
							</div>
						</div>
					</div>
					<div class="form-group row pb-3">
						<label for="rr" class="col-sm-3 col-form-label">RR (min)</label>
						<div class="col-sm-9">
							<div class="input-group">
								<input name="rr" type="number" step="any" class="form-control" />
							</div>
						</div>
					</div>
					<div class="form-group row pb-3">
						<label for="sp02" class="col-sm-3 col-form-label">SpO2 (%)</label>
						<div class="col-sm-9">
							<div class="input-group">
								<input id="sp02" name="sp02" type="number" step="any" class="form-control" />
							</div>
						</div>
					</div>
					<div class="form-group row pb-3">
						<label for="height" class="col-sm-3 col-form-label">Height (cm) </label>
						<div class="col-sm-9">
							<div class="input-group">
								<input
									id="height"
									bind:value={height}
									name="height"
									type="number"
									step="any"
									class="form-control"
								/>
							</div>
						</div>
					</div>
					<div class="form-group row pb-3">
						<label for="weight" class="col-sm-3 col-form-label">Weight (kg)</label>
						<div class="col-sm-9">
							<div class="input-group">
								<input
									id="weight"
									bind:value={weight}
									name="weight"
									type="number"
									step="any"
									class="form-control"
								/>
							</div>
						</div>
					</div>
					<div class="form-group row pb-3">
						<label for="bmi" class="col-sm-3 col-form-label">BMI </label>
						<div class="col-sm-9">
							<div class="row">
								<div class="col-6">
									<div class="input-group">
										<input
											value={bmi.number.toFixed(1) ?? ''}
											disabled
											id="bmi"
											name="bmi"
											type="text"
											class="form-control"
										/>
									</div>
								</div>
								<div class="col-6">
									<div class="input-group">
										<input
											bind:value={bmi.string}
											disabled
											id="bmi_color"
											name="bmi_color"
											type="text"
											class="form-control text-white"
											style="background-color: {bmi.color};"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>
		<div class="card-footer">
			<a href="/patient/all" class="btn btn-light"><i class="fas fa-undo"></i> Cancel</a>
			<div class="float-end">
				<SubmitButton />
			</div>
		</div>
	</form>
</div>
