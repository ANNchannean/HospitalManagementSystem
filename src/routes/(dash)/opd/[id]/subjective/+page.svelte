<script lang="ts">
	import SubmitButton from '$lib/components/etc/SubmitButton.svelte';
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';
	import TextEditor from '$lib/components/etc/TextEditor.svelte';
	import Words from '$lib/components/etc/Words.svelte';
	export let data: PageServerData;
	$: ({ get_visit, get_words } = data);
	const { get_visit: visit } = data;
	let loading = false;
	let cheif_complaint = visit?.subjective?.cheif_complaint ?? '';
	let history_of_present_illness = visit?.subjective?.history_of_present_illness ?? '';
	let current_medication = visit?.subjective?.current_medication ?? '';
	let past_medical_history = visit?.subjective?.past_medical_history ?? '';
	let allesgy_medicine = visit?.subjective?.allesgy_medicine ?? '';
	let surgical_history = visit?.subjective?.surgical_history ?? '';
	let family_and_social_history = visit?.subjective?.family_and_social_history ?? '';
</script>

<Words
	bind:value={past_medical_history}
	words={get_words.filter((e) => e.type === 'past_medical_history')}
	modal_name="past_medical_history"
/>
<Words
	bind:value={cheif_complaint}
	words={get_words.filter((e) => e.type === 'cheif_complaint')}
	modal_name="cheif_complaint"
/>
<Words
	bind:value={history_of_present_illness}
	words={get_words.filter((e) => e.type === 'history_of_present_illness')}
	modal_name="history_of_present_illness"
/>
<Words
	bind:value={current_medication}
	words={get_words.filter((e) => e.type === 'current_medication')}
	modal_name="current_medication"
/>
<Words
	bind:value={allesgy_medicine}
	words={get_words.filter((e) => e.type === 'allesgy_medicine')}
	modal_name="allesgy_medicine"
/>
<Words
	bind:value={surgical_history}
	words={get_words.filter((e) => e.type === 'surgical_history')}
	modal_name="surgical_history"
/>
<Words
	bind:value={family_and_social_history}
	words={get_words.filter((e) => e.type === 'family_and_social_history')}
	modal_name="family_and_social_history"
/>

<div class="card">
	<div class="card-header fs-5">
		<span># Subjective</span>
	</div>
	<form
		data-sveltekit-noscroll
		data-sveltekit-keepfocus
		enctype="multipart/form-data"
		use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				await update({ reset: false });
				loading = false;
			};
		}}
		action="?/create_subjective"
		method="post"
		class="form-horizontal"
	>
		<div class="card-body">
			<div class="form-group row pb-2">
				<div class="col-sm-3">
					<button
						data-bs-toggle="modal"
						data-bs-target="#cheif_complaint"
						type="button"
						class="btn btn-outline-primary btn-sm">Cheif complaint</button
					>
				</div>
				<!-- <label for="cheif_coplaint" class="col-sm-3 col-form-label">Cheif complaint</label> -->
				<div class="col-sm-9">
					<TextEditor
						height={100}
						id="cheif_complaint_id"
						name="cheif_complaint"
						setValue={cheif_complaint ?? ''}
					/>
				</div>
			</div>
			<div class="form-group row pb-2">
				<div class="col-sm-3">
					<button
						data-bs-toggle="modal"
						data-bs-target="#history_of_present_illness"
						type="button"
						class="btn btn-outline-primary btn-sm">History of Present illness</button
					>
				</div>
				<!-- <label for="cheif_coplaint" class="col-sm-3 col-form-label">Cheif complaint</label> -->
				<div class="col-sm-9">
					<TextEditor
						height={100}
						id="history_of_present_illness_id"
						name="history_of_present_illness"
						setValue={history_of_present_illness ?? ''}
					/>
				</div>
			</div>
			<span class="btn btn-sm btn-info">Past Medicine History</span>
			<hr />
			<div class="form-group row pb-2">
				<div class="col-sm-3">
					<button
						data-bs-toggle="modal"
						data-bs-target="#current_medication"
						type="button"
						class="btn btn-outline-primary btn-sm">Current Medication</button
					>
				</div>
				<div class="col-sm-9">
					<div class="input-group">
						<input
							value={current_medication ?? ''}
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
					<button
						data-bs-toggle="modal"
						data-bs-target="#past_medical_history"
						type="button"
						class="btn btn-outline-primary btn-sm">Past medical history</button
					>
				</div>
				<div class="col-sm-9">
					<div class="input-group">
						<input
							value={past_medical_history}
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
					<button
						data-bs-toggle="modal"
						data-bs-target="#allesgy_medicine"
						type="button"
						class="btn btn-outline-primary btn-sm">Allergy medicine</button
					>
				</div>

				<div class="col-sm-9">
					<div class="input-group">
						<input
							value={allesgy_medicine ?? ''}
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
					<button
						data-bs-toggle="modal"
						data-bs-target="#surgical_history"
						type="button"
						class="btn btn-outline-primary btn-sm">Surgical history</button
					>
				</div>

				<div class="col-sm-9">
					<div class="input-group">
						<input
							value={surgical_history ?? ''}
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
					<button
						data-bs-toggle="modal"
						data-bs-target="#family_and_social_history"
						type="button"
						class="btn btn-outline-primary btn-sm">Family and social history</button
					>
				</div>

				<div class="col-sm-9">
					<div class="input-group">
						<input
							value={family_and_social_history ?? ''}
							id="family_and_social_history"
							name="family_and_social_history"
							type="text"
							class="form-control"
						/>
					</div>
				</div>
			</div>
		</div>
		<div class="card-footer">
			<div class="d-grid gap-2 d-md-flex justify-content-md-end">
				<SubmitButton />
			</div>
		</div>
	</form>
</div>
