<script lang="ts">
	import { enhance } from '$app/forms';
	import SubmitButton from '$lib/coms/SubmitButton.svelte';
	import Select from './Select.svelte';
	interface Diagnosis {
		id: number;
		diagnosis: string | null;
		diagnosis_khmer: string | null;
		diagnosis_type_id: number | null;
	}
	interface Diagnosis_Type {
		id: number;
		diagnosis_type: string;
	}
	export let diagnosis: Diagnosis[];
	export let diagnosis_type: Diagnosis_Type[];
	let q: string = '';
	let diagnosis_type_id: number;
	$: get_diagnosis_by_type = diagnosis.filter((e) => e.diagnosis_type_id === diagnosis_type_id);
	$: find_diagnosis = get_diagnosis_by_type.filter((el: Diagnosis) =>
		el?.diagnosis?.toLowerCase().includes(q.toLowerCase())
	);
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
	let diagnosis_id: number;
	let diagnosis_ = '';
	$: if (isEdit === false) diagnosis_ = '';
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
				<h4 class="modal-title">{name}</h4>
				<button
					id="close_diagnosis"
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
							diagnosis_id = 0;
							isEdit = false;
						};
					}}
					action={diagnosis_id > 0 && isEdit
						? '/opd/words/?/update_words'
						: '/opd/words/?/create_words'}
					method="post"
				>
					<input type="hidden" name="id" value={diagnosis_id ?? ''} />
					<div class="form-group pb-3">
						<div class="row">
							<div class="col">
								<Select
									bind:value={diagnosis_type_id}
									name="diagnosis_type"
									items={diagnosis_type.map((e) => ({ id: e.id, name: e.diagnosis_type }))}
								/>
							</div>
							<div class="col">
								<input
									value={diagnosis_}
									required
									name="diagnosis"
									type="text"
									placeholder="New diagnosis"
									class="form-control"
								/>
							</div>
							<div class="col-auto">
								<SubmitButton {loading} name="Add" />
							</div>
						</div>
					</div>
				</form>
				<div class="card">
					<div class="card-header">
						<input
							bind:value={q}
							name="diagnosis"
							type="search"
							placeholder="Search"
							class="form-control"
						/>
					</div>
					<div style="height: 500px;" class="card-body overflow-auto">
						<div class="p-2">
							{#each find_diagnosis as item}
								<div class="p-2">
									<form
										use:enhance={() => {
											loading = true;
											return async ({ update }) => {
												await update({ reset: true });
												loading = false;
												diagnosis_id = 0;
												isEdit = false;
											};
										}}
										action="/opd/words/?/delete_words"
										method="post"
									>
										<input type="hidden" name="id" value={item.id} />

										<input
											on:click={() => {
												handleText(item?.diagnosis ?? '');
											}}
											checked={value.includes(' '.concat(item?.diagnosis ?? '').concat(','))}
											class="form-check-input"
											type="checkbox"
											id={item.id.toString()}
											value={item.diagnosis}
										/>
										<label for={item.id.toString()} class="custom-control-label"
											>{item.diagnosis}{item.diagnosis_khmer}</label
										>
										<button
											type="button"
											class={diagnosis_id === item.id && isEdit
												? 'btn btn-link m-0 p-0'
												: 'btn btn-link text-secondary m-0 p-0'}
											on:click={() => {
												diagnosis_id = 0;
												diagnosis_id = item.id;
												isEdit = !isEdit;
												diagnosis_ = '';
												diagnosis_ = item?.diagnosis ?? '';
											}}><i class="fa-solid fa-file-pen"></i></button
										>
										{#if diagnosis_id === item.id && isEdit}
											<button class="btn btn-link text-danger m-0 p-0" type="submit"
												><i class="fa-solid fa-x"></i></button
											>
										{/if}
									</form>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
