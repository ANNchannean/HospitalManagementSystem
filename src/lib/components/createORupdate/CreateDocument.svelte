<script lang="ts">
	import { enhance } from '$app/forms';
	import SubmitButton from '$lib/components/etc/SubmitButton.svelte';
	import type { PageServerData } from '../../../routes/(dash)/patient/opd/$types';
	export let data: PageServerData;
	export let visit_id: number;
	$: ({ get_visits, get_form_documents } = data);
	$: find_visit = get_visits.find((e) => e.id === visit_id);
	let loading = false;
	let document_id = 0;

</script>

<!-- @_List_Parameter -->
<div class="modal fade" id="create_document" data-bs-backdrop="static">
	<div class="modal-dialog modal-dialog-scrollabl modal-xl">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title">Create Document</h4>
				<button
					data-bs-toggle="modal"
					data-bs-target="#create_document"
					id="nest_create_document"
					type="button"
					class="d-none"
				>
				</button>
				<button
					id="close_create_document"
					type="button"
					class="btn-close"
					data-bs-dismiss="modal"
					aria-label="Close"
				>
				</button>
			</div>
			<form
				class="modal-body"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						await update({ reset: false });
						loading = false;
					};
				}}
				action="?/create_document"
				method="post"
			>
				<input value={find_visit?.id} type="hidden" name="visit_id" />
				<div class="card">
					<h5 class="card-header">Form Document</h5>
					<div class="card-body">
						<div class=" form-group row">
							{#each get_form_documents as item (item.id)}
								<div class="col-sm-3">
									<div class="form-check">
										<input
											name="document_title"
											class="form-check-input"
											type="checkbox"
											checked={find_visit?.document.some((e) => e.title === item.title)}
											id={item.id.toString()}
											value={item.title}
										/>
										<label for={item.id.toString()} class="custom-control-label">{item.title}</label
										>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>
				<br />
				{#each find_visit?.document || [] as item (item.id)}
					<button
						on:click={() => {
							document_id = 0;
							document_id = item.id;
						}}
						data-bs-toggle="modal"
						data-bs-target="#view_document"
						type="button"
						class="btn btn-primary w-100 my-2"
					>
						{item.title}
					</button>
				{/each}

				<br />
				<div class="modal-footer justify-content-end">
					<SubmitButton {loading} />
				</div>
			</form>
		</div>
	</div>
</div>

