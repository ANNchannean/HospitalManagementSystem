<script lang="ts">
	import { enhance } from '$app/forms';
	import SubmitButton from '$lib/components/etc/SubmitButton.svelte';
	import { t } from '$lib/translations';
	interface Words {
		id: number;
		text: string;
		type: string;
	}
	export let words: Words[];
	$: find_words = words.filter((e) => e.type === words_type);
	export let words_type: string;
	let loading = false;
	export let modal_name: string;
</script>

<!-- @_List_Parameter -->
<div class="modal fade" id={modal_name} data-bs-backdrop="static">
	<div class="modal-dialog modal-dialog-scrollabl modal-xl">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title">Words</h4>
				<button
					id="close_words"
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
				action="?/Word"
				method="post"
			>
				<div class="card">
					<h5 class="card-header">Word</h5>
					<div class="card-body">
						<div class=" form-group row">
							{#each find_words as item (item.id)}
								<div class="col-sm-3">
									<div class="form-check">
										<input
											class="form-check-input"
											type="checkbox"
											id={item.id.toString()}
											value={item.text}
										/>
										<label for={item.id.toString()} class="custom-control-label">{item.text}</label>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>

				<div class="modal-footer justify-content-end">
					<SubmitButton {loading} />
				</div>
			</form>
		</div>
	</div>
</div>
