<script lang="ts">
	import SubmitButton from '$lib/components/SubmitButton.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';
	export let data: PageServerData;
	$: ({ get_visit } = data);
	let loading = false;
	onMount(() => {
		if (browser) {
			const jQuery = (window as any).$;
			jQuery(document).ready(function () {
				// jQuery('select').selectpicker();
				jQuery('#cheif_coplaint').summernote({
					toolbar: [
						// [groupName, [list of button]]
						['fontstyle', ['fontname', 'fontsize']],
						['style', ['bold', 'italic', 'underline', 'clear']],
						['font', ['strikethrough', 'superscript', 'subscript']],
						['color', ['color']],
						['para', ['ul', 'ol', 'paragraph']],
						['height', ['height']],
						['table']
						// ['insert',['picture']],
					],

					tabsize: 2,
					height: 200
				});
			});
		}
	});
	onDestroy(() => {
		if (browser) {
			const jQuery = (window as any).$;
			jQuery(document).ready(function () {
				// jQuery('select').selectpicker();
				jQuery('#cheif_coplaint').summernote('destroy');
			});
		}
	});
	function destroy_summernote() {
		const jQuery = (window as any).$;
		jQuery(document).ready(function () {
			// jQuery('select').selectpicker();
			jQuery('#cheif_coplaint').summernote('destroy');
		});
	}
	function create_summernote() {
		if (browser) {
			const jQuery = (window as any).$;
			jQuery(document).ready(function () {
				// jQuery('select').selectpicker();
				jQuery('#cheif_coplaint').summernote({
					toolbar: [
						// [groupName, [list of button]]
						['fontstyle', ['fontname', 'fontsize']],
						['style', ['bold', 'italic', 'underline', 'clear']],
						['font', ['strikethrough', 'superscript', 'subscript']],
						// ['color', ['color']],
						['para', ['ul', 'ol', 'paragraph']],
						['height', ['height']],
						['table']
						// ['insert',['picture']],
					],
					tabsize: 2,
					height: 200
				});
			});
		}
	}
</script>

<div class="card">
	<div class="card-header fs-4">
		<span># Subjective</span>
	</div>
	<form
		enctype="multipart/form-data"
		use:enhance={() => {
			loading = true;
			return async ({ update, result }) => {
				await update();
				loading = false;
				if (result.type !== 'failure') {
				}
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
					<textarea
						value={get_visit?.subjective?.cheif_complaint ?? ''}
						id="cheif_coplaint"
						name="cheif_complaint"
						rows="4"
						class="form-control"
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
