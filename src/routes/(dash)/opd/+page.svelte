<script lang="ts">
	import SubmitButton from '$lib/coms/SubmitButton.svelte';
	import type { PageServerData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import Select from '$lib/coms/Select.svelte';
	import Toast from '$lib/coms/Toast.svelte';
	import TextEditor from '$lib/coms/TextEditor.svelte';
	import { t } from '$lib/translations';
	import Words from '$lib/coms-cu/Words.svelte';
	export let data: PageServerData;
	export let form: ActionData;
	$: ({ get_staffs, get_patient, get_departments, get_words } = data);
	let height = 0;
	let weight = 0;
	let asign_vitalsign = false;
	let assign_subjective = false;
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
	let loading = false;
	let cheif_complaint = '';
	let history_of_present_illness = '';
	let current_medication = '';
	let past_medical_history = '';
	let allesgy_medicine = '';
	let surgical_history = '';
	let etiology = '';
	let family_and_social_history = '';
</script>

{#if form?.visit_id}
	<Toast toas="infomation" message="សូមជ្រើសរើសឈ្មេាះអ្នកជំងឺជាមុនសិន!" />
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
	<div class="card-header fs-5">
		<span>#{get_patient?.name_khmer}, </span>
		<span>{get_patient?.name_latin} </span>
	</div>

	<form
		method="post"
		action="?/create_visit_opd"
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
					<div class="col-sm-3">
						<Words
							name="Etiology"
							bind:value={etiology}
							words={get_words.filter((e) => e.type === 'etiology')}
							modal_name="etiology"
						/>
					</div>
					<div class="col-sm-9">
						<input
							bind:value={etiology}
							name="etiology"
							type="text"
							class="form-control"
							id="etiology"
						/>
						{#if form?.etiology}
							<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
						{/if}
					</div>
				</div>
				<div class="form-group row pb-3">
					<label for="staff" class="col-sm-3 col-form-label">Staff</label>
					<div class="col-sm-9">
						<Select name="staff_id" items={get_staffs.map((e) => ({ id: e.id, name: e.name }))} />
						{#if form?.staff_id}
							<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
						{/if}
					</div>
				</div>
				<div class="form-group row pb-3">
					<label for="ddepartment_idoctor" class="col-sm-3 col-form-label">Department</label>
					<div class="col-sm-9">
						<Select
							name="department_id"
							items={get_departments.map((e) => ({ id: e.id, name: e.department }))}
						/>
						{#if form?.department_id}
							<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
						{/if}
					</div>
				</div>
			</div>
			<div class="form-check">
				<input
					bind:checked={asign_vitalsign}
					class="form-check-input"
					type="checkbox"
					name="asign_vitalsing"
					id="asign_vitalsign"
				/>
				<label class="form-check-label" for="asign_vitalsign">Accept vitalsign</label>
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
			<div class="form-check">
				<input
					bind:checked={assign_subjective}
					class="form-check-input"
					type="checkbox"
					name="assign_subjective"
					id="assign_subjective"
				/>
				<label class="form-check-label" for="assign_subjective">Accept Subjective</label>
			</div>
			<hr />
			{#if assign_subjective}
				<div class="form-group row pb-2">
					<div class="col-sm-3">
						<Words
							name="Cheif complaint"
							bind:value={cheif_complaint}
							words={get_words.filter((e) => e.type === 'cheif_complaint')}
							modal_name="cheif_complaint"
						/>
					</div>
					<!-- <label for="cheif_coplaint" class="col-sm-3 col-form-label">Cheif complaint</label> -->
					<div class="col-sm-9">
						<TextEditor height={100} name="cheif_complaint" bind:setValue={cheif_complaint} />
					</div>
				</div>
				<div class="form-group row pb-2">
					<div class="col-sm-3">
						<Words
							name="History of Present illness"
							bind:value={history_of_present_illness}
							words={get_words.filter((e) => e.type === 'history_of_present_illness')}
							modal_name="history_of_present_illness"
						/>
					</div>
					<!-- <label for="cheif_coplaint" class="col-sm-3 col-form-label">Cheif complaint</label> -->
					<div class="col-sm-9">
						<TextEditor
							height={100}
							name="history_of_present_illness"
							bind:setValue={history_of_present_illness}
						/>
					</div>
				</div>
				<span class="btn btn-sm btn-info">Past Medicine History</span>
				<hr />
				<div class="form-group row pb-2">
					<div class="col-sm-3">
						<Words
							name="Current Medication"
							bind:value={current_medication}
							words={get_words.filter((e) => e.type === 'current_medication')}
							modal_name="current_medication"
						/>
					</div>
					<div class="col-sm-9">
						<div class="input-group">
							<input
								bind:value={current_medication}
								id="current_medication"
								name="current_medication"
								type="text"
								class="form-control"
							/>
						</div>
					</div>
				</div>
				<div class="form-group row pb-2">
					<div class="col-sm-3">
						<Words
							name="Past medical history"
							bind:value={past_medical_history}
							words={get_words.filter((e) => e.type === 'past_medical_history')}
							modal_name="past_medical_history"
						/>
					</div>
					<div class="col-sm-9">
						<div class="input-group">
							<input
								bind:value={past_medical_history}
								id="past_medical_history"
								name="past_medical_history"
								type="text"
								class="form-control"
							/>
						</div>
					</div>
				</div>
				<div class="form-group row pb-2">
					<div class="col-sm-3">
						<Words
							name="Allergy medicine"
							bind:value={allesgy_medicine}
							words={get_words.filter((e) => e.type === 'allesgy_medicine')}
							modal_name="allesgy_medicine"
						/>
					</div>

					<div class="col-sm-9">
						<div class="input-group">
							<input
								bind:value={allesgy_medicine}
								id="allesgy_medicine_"
								name="allesgy_medicine"
								type="text"
								class="form-control"
							/>
						</div>
					</div>
				</div>
				<div class="form-group row pb-2">
					<div class="col-sm-3">
						<Words
							name="Surgical history"
							bind:value={surgical_history}
							words={get_words.filter((e) => e.type === 'surgical_history')}
							modal_name="surgical_history"
						/>
					</div>

					<div class="col-sm-9">
						<div class="input-group">
							<input
								bind:value={surgical_history}
								id="surgical_history"
								name="surgical_history"
								type="text"
								class="form-control"
							/>
						</div>
					</div>
				</div>
				<div class="form-group row pb-2">
					<div class="col-sm-3">
						<Words
							name="Family and social history"
							bind:value={family_and_social_history}
							words={get_words.filter((e) => e.type === 'family_and_social_history')}
							modal_name="family_and_social_history"
						/>
					</div>

					<div class="col-sm-9">
						<div class="input-group">
							<input
								bind:value={family_and_social_history}
								id="family_and_social_history"
								name="family_and_social_history"
								type="text"
								class="form-control"
							/>
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
