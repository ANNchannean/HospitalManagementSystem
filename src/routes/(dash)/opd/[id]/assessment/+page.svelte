<script lang="ts">
	import SubmitButton from '$lib/components/SubmitButton.svelte';
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';
	import Select from '$lib/components/Select.svelte';
	export let data: PageServerData;
	$: ({ get_diagnosis, get_diagnosisTypes, get_accessment } = data);
	let diagnosis_type_id: number;
	$: find_diagnosis = get_diagnosis.filter(
		(e) => e.diagnosis_type_id === Number(diagnosis_type_id)
	);
	let diagnosis: string = '';
	let diagnosis_ = data.get_accessment?.diagnosis_or_problem ?? '';
	let diagnosis_1 = data.get_accessment?.differential_diagnosis ?? '';
	let loading = false;
	function add() {
		if (diagnosis) {
			diagnosis_ = diagnosis_.concat(diagnosis).concat(',');
		}
	}
	function add1() {
		if (diagnosis) {
			diagnosis_1 = diagnosis_1.concat(diagnosis).concat(',');
		}
	}
</script>

<div class="card">
	<div class="card-header fs-4">
		<span># Assessment</span>
	</div>
	<form
		use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				await update({ reset: false });
				loading = false;
			};
		}}
		action="?/create_accessment"
		method="post"
		class="form-horizontal"
	>
		<div class="card-body">
			<div class="form-group row pb-3">
				<label for="familly_history" class="col-sm-3 col-form-label">Diagnosis </label>
				<div class="col-sm-9">
					<div class="row">
						<div class="col-4">
							<div class="input-group">
								<Select
									bind:value={diagnosis_type_id}
									items={get_diagnosisTypes.map((e) => ({ id: e.id, name: e.diagnosis_type }))}
								/>
							</div>
						</div>
						<div class="col-8">
							<div class="input-group">
								<Select
									bind:value={diagnosis}
									items={find_diagnosis.map((e) => ({
										id: e.diagnosis,
										name: e.diagnosis?.concat(e.diagnosis_khmer || '')
									}))}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="form-group row pb-3">
				<label for="familly_history" class="col-sm-3 col-form-label">Send to </label>
				<div class="col-sm-9">
					<div class="row">
						<div class="col">
							<button
								on:click={() => {
									add();
								}}
								type="button"
								class="btn btn-secondary w-100">Diagnosis or Problem</button
							>
						</div>
						<div class="col">
							<button
								on:click={() => {
									add1();
								}}
								type="button"
								class="btn btn-secondary w-100">Differential Diagnosis</button
							>
						</div>
					</div>
				</div>
			</div>
			<div class="form-group row pb-3">
				<label for="familly_history" class="col-sm-3 col-form-label">Diagnosis or Problem :</label>
				<div class="col-sm-9">
					<div class="input-group">
						<div class="input-group">
							<textarea
								bind:value={diagnosis_}
								id="diagnosis"
								name="diagnosis"
								rows="5"
								class="form-control"
							/>
						</div>
					</div>
				</div>
			</div>
			<div class="form-group row">
				<label for="diagnosis_differential" class="col-sm-3 col-form-label"
					>Differential Diagnosis :</label
				>
				<div class="col-sm-9">
					<div class="input-group">
						<textarea
							bind:value={diagnosis_1}
							id="diagnosis_differential"
							name="diagnosis_differential"
							rows="5"
							class="form-control"
						/>
					</div>
				</div>
			</div>

			<div class="float-end py-4">
				<SubmitButton {loading} />
			</div>
		</div>
	</form>
</div>
