<script lang="ts">
	import SubmitButton from '$lib/components/etc/SubmitButton.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';
	import TextEditor from '$lib/components/etc/TextEditor.svelte';
	export let data: PageServerData;
	$: ({ get_visit } = data);
	let loading = false;
</script>

<div class="card">
	<div class="card-header fs-4">
		<span># Subjective</span>
	</div>
	<form
		enctype="multipart/form-data"
		use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				await update();
				loading = false;
			};
		}}
		action="?/create_subjective"
		method="post"
		class="form-horizontal"
	>
		<div class="card-body">
			<div class="form-group row pb-2">
				<label for="cheif_coplaint" class="col-sm-3 col-form-label">Cheif complaint</label>
				<div class="col-sm-9">
					<TextEditor
						height={200}
						id={get_visit?.subjective?.id.toString()}
						name="cheif_complaint"
						setValue={get_visit?.subjective?.cheif_complaint ?? ''}
					/>
				</div>
			</div>
			<div class="form-group row pb-2">
				<label for="present_illness" class="col-sm-3 col-form-label">Present illness</label>
				<div class="col-sm-9">
					<div class="input-group">
						<input
							value={get_visit?.subjective?.present_illness ?? ''}
							id="present_illness"
							name="present_illness"
							type="text"
							class="form-control"
						/>
					</div>
				</div>
			</div>
			<div class="form-group row pb-2">
				<label for="past_history" class="col-sm-3 col-form-label">Past history</label>
				<div class="col-sm-9">
					<div class="input-group">
						<input
							value={get_visit?.subjective?.past_history ?? ''}
							id="past_history"
							name="past_history"
							type="text"
							class="form-control"
						/>
					</div>
				</div>
			</div>
			<div class="form-group row pb-2">
				<label for="past_medicine_history" class="col-sm-3 col-form-label"
					>Past medicine history</label
				>
				<div class="col-sm-9">
					<div class="input-group">
						<input
							value={get_visit?.subjective?.past_medicine_history ?? ''}
							id="past_medicine_history"
							name="past_medicine_history"
							type="text"
							class="form-control"
						/>
					</div>
				</div>
			</div>
			<div class="form-group row pb-2">
				<label for="allesgy_medicine" class="col-sm-3 col-form-label">Allesgy medicine</label>
				<div class="col-sm-9">
					<div class="input-group">
						<input
							value={get_visit?.subjective?.allesgy_medicine ?? ''}
							id="allesgy_medicine_"
							name="allesgy_medicine"
							type="text"
							class="form-control"
						/>
					</div>
				</div>
			</div>
			<div class="form-group row pb-2">
				<label for="surgical_history" class="col-sm-3 col-form-label">Surgical history</label>
				<div class="col-sm-9">
					<div class="input-group">
						<input
							value={get_visit?.subjective?.surgical_history ?? ''}
							id="surgical_history"
							name="surgical_history"
							type="text"
							class="form-control"
						/>
					</div>
				</div>
			</div>
			<div class="form-group row pb-2">
				<label for="familly_history" class="col-sm-3 col-form-label">Familly history</label>
				<div class="col-sm-9">
					<div class="input-group">
						<input
							value={get_visit?.subjective?.familly_history ?? ''}
							id="familly_history_"
							name="familly_history"
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
