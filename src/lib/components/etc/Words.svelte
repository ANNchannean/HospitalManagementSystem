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
	let q: string = '';
	$: find_words = words.filter((el: Words) => el?.text.toLowerCase().includes(q.toLowerCase()));
	let loading = false;
	export let modal_name: string;
	export let value = '';
	
</script>

<!-- @_List_Parameter -->
<div class="modal fade" id={modal_name}>
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
			<div class="modal-body">
				<form
					use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							await update({ reset: false });
							loading = false;
						};
					}}
					action="/opd/words/?/create_words"
					method="post"
				>
					<div class="form-group pb-3">
						<div class="row">
							<div class="col">
								<input bind:value={q} type="search" placeholder="Search" class="form-control" />
							</div>
							<input type="hidden" name="type" value={modal_name} />
							<div class="col">
								<input
									required
									name="word"
									type="text"
									placeholder="New Word"
									class="form-control"
								/>
							</div>
							<div class="col-auto">
								<SubmitButton />
							</div>
						</div>
					</div>
				</form>
				<div class=" form-group row pb-3">
					{#each find_words as item (item.id)}
						{#if item.text}
							<div class=" col-3 p-2">
								<div class="form-check">
									<input
										bind:group={value}
										class="form-check-input"
										type="checkbox"
										id={item.id.toString()}
										value={item.text}
									/>
									<label for={item.id.toString()} class="custom-control-label">{item.text}</label>
								</div>
							</div>
						{/if}
					{/each}
				</div>
				<div class="modal-footer"></div>
			</div>
		</div>
	</div>
</div>
