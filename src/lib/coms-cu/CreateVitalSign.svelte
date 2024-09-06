<script lang="ts">
	import type { PageServerData } from '../../routes/(dash)/opd/[id]/objective/$types';
	import { enhance } from '$app/forms';
	import SubmitButton from '$lib/coms/SubmitButton.svelte';
	type Data = Pick<PageServerData, 'get_visit'>;
	export let data: Data;
	$: ({ get_visit } = data);
	let loading = false;
	let height: number = data.get_visit?.vitalSign?.height || 0;
	let weight: number = data.get_visit?.vitalSign?.weight || 0;
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

<!-- @_Add_ParameterGrop -->
<div class="modal fade" id="create_vital_sign" data-bs-backdrop="static">
	<div class="modal-dialog modal-xl">
		<form
			action="?/create_vital_sign"
			method="post"
			class="modal-content"
			use:enhance={() => {
				loading = true;
				return async ({ update, result }) => {
					await update({ reset: false });
					loading = false;
					if (result.type !== 'failure') {
						document.getElementById('close_vital_sign')?.click();
					}
				};
			}}
		>
			<input type="hidden" name="bmi" value={bmi?.number || ''} />
			<div class="modal-header">
				<h4 class="modal-title">VitalSign</h4>
				<button
					id="close_vital_sign"
					type="button"
					class="btn-close"
					data-bs-dismiss="modal"
					aria-label="Close"
				>
				</button>
			</div>
			<div class="modal-body">
				<div class="card-body pt-0">
					<div class="form-group row pb-3">
						<label for="bp" class="col-sm-3 col-form-label">BP (mmHg)</label>
						<div class="col-sm-9">
							<div class="row">
								<div class="col-sm-6">
									<div class="input-group">
										<input
											value={get_visit?.vitalSign?.sbp?.toFixed(0) ?? ''}
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
											value={get_visit?.vitalSign?.dbp?.toFixed(1) ?? ''}
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
								<input
									value={get_visit?.vitalSign?.pulse?.toFixed(0) ?? ''}
									id="pulse"
									name="pulse"
									type="number"
									step="any"
									class="form-control"
								/>
							</div>
						</div>
					</div>
					<div class="form-group row pb-3">
						<label for="t" class="col-sm-3 col-form-label">T (C)</label>
						<div class="col-sm-9">
							<div class="input-group">
								<input
									value={get_visit?.vitalSign?.t?.toFixed(1) ?? ''}
									id="t"
									name="t"
									type="number"
									step="any"
									class="form-control"
								/>
							</div>
						</div>
					</div>
					<div class="form-group row pb-3">
						<label for="rr" class="col-sm-3 col-form-label">RR (min)</label>
						<div class="col-sm-9">
							<div class="input-group">
								<input
									value={get_visit?.vitalSign?.rr?.toFixed(0) ?? ''}
									id="rr"
									name="rr"
									type="number"
									step="any"
									class="form-control"
								/>
							</div>
						</div>
					</div>
					<div class="form-group row pb-3">
						<label for="sp02" class="col-sm-3 col-form-label">SpO2 (%)</label>
						<div class="col-sm-9">
							<div class="input-group">
								<input
									value={get_visit?.vitalSign?.sp02?.toFixed(1) ?? ''}
									id="sp02"
									name="sp02"
									type="number"
									step="any"
									class="form-control"
								/>
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
			</div>
			<div class="modal-footer justify-content-end">
				<SubmitButton {loading} />
			</div>
		</form>
	</div>
</div>
