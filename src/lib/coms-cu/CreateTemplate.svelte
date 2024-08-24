<script lang="ts">
	import { enhance } from '$app/forms';
	import { t } from '$lib/translations';
	import type {
		ActionData,
		PageServerData
	} from '../../routes/(dash)/settup/img-template/$types';
	import SubmitButton from '$lib/coms/SubmitButton.svelte';
	import TextEditor from '$lib/coms/TextEditor.svelte';
	export let form: ActionData;
	export let template_id: number;
	export let data: PageServerData;
	$: ({ get_templates } = data);
	$: find_template = get_templates.find((e) => e.id === template_id);
	let loading = false;
</script>

<!-- @_List_Parameter -->
<div class="modal fade" id="create_template" data-bs-backdrop="static" data-bs-focus="false">
	<div class="modal-dialog modal-dialog-scrollabl modal-xl">
		<form
			enctype="multipart/form-data"
			action={find_template?.id ? '?/update_template' : '?/create_template'}
			method="post"
			use:enhance={() => {
				loading = true;
				return async ({ update, result }) => {
					await update();
					loading = false;
					if (result.type !== 'failure') {
						template_id = 0;

						document.getElementById('close_create_template')?.click();
					}
				};
			}}
			class="modal-content"
		>
			<div class="modal-header">
				<h4 class="modal-title">Template Imagrie</h4>
				<button
					id="close_create_template"
					type="button"
					class="btn-close"
					data-bs-dismiss="modal"
					aria-label="Close"
				>
				</button>
			</div>
			<div class="card-body pt-0">
				<div class="modal-body">
					<div class="row">
						<div class="col-12">
							<div class="form-group pb-3">
								<input value={find_template?.id} type="hidden" name="template_id" />
								<label for="diagnosis">Diagnosis</label>
								<input
									value={find_template?.diagnosis ?? ''}
									name="diagnosis"
									type="diagnosis"
									class="form-control"
									id="diagnosis"
								/>
								{#if form?.diagnosis}
									<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
								{/if}
							</div>
						</div>
						<div class="col-12">
							<div class="form-group pb-3">
								<label for="template">Template</label>
								<TextEditor
									id={find_template?.id.toString().concat('template_')}
									name="template_"
									setValue={find_template?.template ?? ''}
								/>
								{#if form?.template_}
									<p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
								{/if}
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
