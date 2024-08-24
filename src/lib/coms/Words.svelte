<script lang="ts">
	import { enhance } from '$app/forms';
	import SubmitButton from '$lib/coms/SubmitButton.svelte';
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
	function handleText(text: string) {
		if (value.includes(' '.concat(text).concat(','))) {
			value = value.replace(' '.concat(text.concat(',')), '');
		} else {
			value = value.concat(' '.concat(text)).concat(',');
		}
	}
	let isEdit = false;
	let words_id: number;
	let words_ = '';
	$: if (isEdit === false) words_ = '';
	export let name = '';
	export let Class = 'btn btn-outline-primary btn-sm';
</script>

<button data-bs-toggle="modal" data-bs-target="#{modal_name}" type="button" class={Class}
	>{name}</button
>
<div class="modal fade" id={modal_name}>
	<div class="modal-dialog modal-dialog-scrollabl modal-xl">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title">Words {name}</h4>
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
							await update({ reset: true });
							loading = false;
							words_id = 0;
							isEdit = false;
						};
					}}
					action={words_id > 0 && isEdit
						? '/opd/words/?/update_words'
						: '/opd/words/?/create_words'}
					method="post"
				>
					<input type="hidden" name="id" value={words_id ?? ''} />
					<div class="form-group pb-3">
						<div class="row">
							<div class="col">
								<input bind:value={q} type="search" placeholder="Search" class="form-control" />
							</div>
							<input type="hidden" name="type" value={modal_name} />
							<div class="col">
								<input
									value={words_}
									required
									name="word"
									type="text"
									placeholder="New Word"
									class="form-control"
								/>
							</div>
							<div class="col-auto">
								<SubmitButton {loading} name="Add" />
							</div>
						</div>
					</div>
				</form>
				<div class=" form-group row pb-3">
					{#each find_words as item}
						{#if item.text}
							<div class="col-3 p-2">
								<form
									use:enhance={() => {
										loading = true;
										return async ({ update }) => {
											await update({ reset: true });
											loading = false;
											words_id = 0;
											isEdit = false;
										};
									}}
									action="/opd/words/?/delete_words"
									method="post"
								>
									<input type="hidden" name="id" value={item.id} />

									<input
										on:click={() => {
											handleText(item.text);
										}}
										checked={value.includes(' '.concat(item.text).concat(','))}
										class="form-check-input"
										type="checkbox"
										id={item.id.toString()}
										value={item.text}
									/>
									<label for={item.id.toString()} class="custom-control-label">{item.text}</label>
									<button
										type="button"
										class={words_id === item.id && isEdit
											? 'btn btn-link m-0 p-0'
											: 'btn btn-link text-secondary m-0 p-0'}
										on:click={() => {
											words_id = 0;
											words_id = item.id;
											isEdit = !isEdit;
											words_ = '';
											words_ = item.text;
										}}><i class="fa-solid fa-file-pen"></i></button
									>
									{#if words_id === item.id && isEdit}
										<button class="btn btn-link text-danger m-0 p-0" type="submit"
											><i class="fa-solid fa-x"></i></button
										>
									{/if}
								</form>
							</div>
						{/if}
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
