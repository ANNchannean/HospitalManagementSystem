<script lang="ts">
	import SubmitButton from '$lib/coms/SubmitButton.svelte';
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';
	import Select from '$lib/coms/Select.svelte';
	import TextEditor from '$lib/coms/TextEditor.svelte';
	import Diagnosis from '$lib/coms/Diagnosis.svelte';
	export let data: PageServerData;
	$: ({ get_diagnosis, get_diagnosisTypes, get_remark } = data);
	let diagnosis_type_id: number;
	let diagnosis_ = data.get_accessment?.diagnosis_or_problem ?? '';
	let differential = data.get_accessment?.differential_diagnosis ?? '';
	let loading = false;
</script>

<div class="card">
	<div class="card-header fs-5">
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
				<!-- <label for="familly_history" class="col-sm-3 col-form-label">Diagnosis or Problem :</label> -->
				<div class="col-sm-3">
					<Diagnosis
						bind:value={diagnosis_}
						modal_name="DiagnosisOrProblem"
						name="Diagnosis or Problem"
						diagnosis={get_diagnosis}
						diagnosis_type={get_diagnosisTypes}
					/>
				</div>
				<div class="col-sm-9">
					<div class="input-group">
						<div class="input-group">
							<textarea
								bind:value={diagnosis_}
								id="diagnosis"
								name="diagnosis_or_problem"
								rows="5"
								class="form-control"
							/>
						</div>
					</div>
				</div>
			</div>
			<div class="form-group row pb-3">
				<div class="col-sm-3">
					<Diagnosis
						bind:value={differential}
						modal_name="DifferentialDiagnosis"
						name="Differential Diagnosis"
						diagnosis={get_diagnosis}
						diagnosis_type={get_diagnosisTypes}
					/>
				</div>

				<div class="col-sm-9">
					<div class="input-group">
						<textarea
							bind:value={differential}
							id="diagnosis_differential"
							name="diagnosis_differential"
							rows="5"
							class="form-control"
						/>
					</div>
				</div>
			</div>
			<div class="form-group row">
				<label for="diagnosis_differential" class="col-sm-3 col-form-label"
					>Doctor's Comment :</label
				>
				<div class="col-sm-9">
					<TextEditor
						height={200}
						id="description"
						name="description"
						setValue={get_remark?.description ?? ''}
					/>
				</div>
			</div>

			<div class="float-end py-4">
				<SubmitButton {loading} />
			</div>
		</div>
	</form>
</div>
