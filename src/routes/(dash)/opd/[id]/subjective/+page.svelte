<script lang="ts">
	import SubmitButton from '$lib/components/etc/SubmitButton.svelte';
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';
	import TextEditor from '$lib/components/etc/TextEditor.svelte';
	import Words from '$lib/components/etc/Words.svelte';
	import { globalLoading } from '$lib/store';
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
			$globalLoading = true;
			return async ({ update }) => {
				await update({ reset: false, invalidateAll: true });
				loading = false;
				$globalLoading = false;
			};
		}}
		action="?/create_subjective"
		method="post"
		class="form-horizontal"
	>
		<div class="card-body">
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
					<TextEditor
						height={100}
						id="cheif_complaint_id"
						name="cheif_complaint"
						bind:setValue={cheif_complaint}
					/>
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
						id="history_of_present_illness_id"
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
		</div>
		<div class="card-footer">
			<div class="d-grid gap-2 d-md-flex justify-content-md-end">
				<SubmitButton />
			</div>
		</div>
	</form>
</div>
