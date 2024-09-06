<script lang="ts">
	import SubmitButton from '$lib/coms/SubmitButton.svelte';
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';
	import Diagnosis from '$lib/coms/Diagnosis.svelte';
	export let data: PageServerData;
	$: ({ get_diagnosis, get_diagnosisTypes } = data);
	let loading = false;
	let diagnosis_ = data.get_accessment?.diagnosis_or_problem ?? '';
	let differential = data.get_accessment?.differential_diagnosis ?? '';
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

			<div class="float-end py-4">
				<SubmitButton {loading} />
			</div>
		</div>
	</form>
</div>
