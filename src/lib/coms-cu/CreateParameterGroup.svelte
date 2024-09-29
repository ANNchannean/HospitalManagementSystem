<script lang="ts">
	import type {
		ActionData,
		PageServerData
	} from '../../routes/(dash)/settup/parameter/group/$types';
	import { enhance } from '$app/forms';
	import SubmitButton from '$lib/coms/SubmitButton.svelte';
	import { _ } from 'svelte-i18n';
	import Select from '$lib/coms/Select.svelte';
	type Data = Pick<PageServerData, 'get_lab_groups' | 'get_product_labo'>;
	export let form: ActionData;
	export let data: Data;
	export let product_lab_id: number;
	let loading = false;
	$: ({ get_lab_groups, get_product_labo } = data);
	$: find_product_labo = get_product_labo[0];
</script>

<!-- @_Add_ParameterGrop -->
<div class="modal fade" id="create_parameter_group" data-bs-backdrop="static">
	<div class="modal-dialog modal-xl">
		<form
			action={find_product_labo?.id ? '?/update_parameter_group' : '?/create_parameter_group'}
			method="post"
			class="modal-content"
			use:enhance={() => {
				loading = true;
				return async ({ update, result }) => {
					await update();
					loading = false;
					if (result.type !== 'failure') {
						product_lab_id = 0;
						document.getElementById('close_create_parameter_group')?.click();
					}
				};
			}}
		>
			<div class="modal-header">
				<h4 class="modal-title">Paramater Group</h4>
				<button
					id="close_create_parameter_group"
					type="button"
					class="btn-close"
					data-bs-dismiss="modal"
					aria-label="Close"
				>
				</button>
			</div>
			<div class="modal-body">
				<div class="card-body pt-0">
					<div class="row">
						<div class="col-12">
							<div class="form-group pb-3">
								<input value={find_product_labo?.id} type="hidden" name="product_id" />
								<label for="product_name">Paramater</label>
								<input
									value={find_product_labo?.products ?? ''}
									name="product_name"
									type="text"
									class="form-control"
									id="product_name"
								/>
								{#if form?.product_name}
									<p class="text-danger p-0 m-0">{$_('input_data')}</p>
								{/if}
							</div>
						</div>
						<div class="col-12">
							<div class="form-group pb-3">
								<label for="lab_group_id">Lab Group</label>
								<Select
									value={find_product_labo?.laboratory_group_id}
									name="lab_group_id"
									items={get_lab_groups.map((e) => {
										return { id: e.id, name: e.laboratory_group };
									})}
								/>

								{#if form?.lab_group_id}
									<p class="text-danger p-0 m-0">{$_('input_data')}</p>
								{/if}
							</div>
						</div>
						<div class="col-12">
							<div class="form-group pb-3">
								<label for="price">Price</label>
								<input
									value={find_product_labo?.price ?? ''}
									name="price"
									type="text"
									class="form-control"
									id="price"
								/>
								{#if form?.price}
									<p class="text-danger p-0 m-0">{$_('input_data')}</p>
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
