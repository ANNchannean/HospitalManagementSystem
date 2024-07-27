<script lang="ts">
	import type { ActionData, PageServerData } from './$types';
	import DeleteModal from '$lib/components/DeleteModal.svelte';
	import CreateParameterGroup from '$lib/components/createORupdate/CreateParameterGroup.svelte';
	import CreateParameter from '$lib/components/createORupdate/CreateParameter.svelte';
	import { browser } from '$app/environment';
	import { inerHight } from '$lib/store';
	export let form: ActionData;
	export let data: PageServerData;
	let product_lab_id: number;
	$: ({ get_product_labo } = data);
	$: find_product_labo = get_product_labo.find((e) => e.id === product_lab_id);
	function create_summernote() {
		if (browser) {
			const jQuery = (window as any).$;
			jQuery(document).ready(function () {
				jQuery('#summernote').summernote({
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
	}
</script>

<CreateParameterGroup {data} {form} {product_lab_id} />
<DeleteModal action="?/delete_parameter_group" id={find_product_labo?.id} />
<CreateParameter {data} {form} product_id={find_product_labo?.id} />

<div class="row">
	<div class="col-sm-6">
		<h2>Parameter Group</h2>
	</div>
	<div class="col-sm-6">
		<ol class="breadcrumb justify-content-end">
			<li class="breadcrumb-item">
				<a href="/dashboard" class="btn btn-link p-0 text-secondary"
					><i class="fas fa-tachometer-alt"></i>
					Home
				</a>
			</li>
			<li class="breadcrumb-item">
				<a href={'#'} class="btn btn-link p-0 text-secondary"
					><i class="fas fa-tools"></i>
					Settup
				</a>
			</li>
			<li class="breadcrumb-item">
				<a href="/settup/parameter/group" class="btn btn-link p-0 text-secondary"
					><i class="fas fa-vial nav-icon"></i>
					Parameter Group
				</a>
			</li>
		</ol>
	</div>
</div>

<div class="row">
	<div class="col-12">
		<div class="card">
			<div class="card-header">
				<div class="row">
					<div class="col">
						<input
							type="text"
							name="table_search"
							class="form-control float-right"
							placeholder="Search"
						/>
					</div>
					<div class="col-auto">
						<button
							on:click={() => {
								product_lab_id = product_lab_id;
							}}
							type="button"
							class="btn btn-success"
							data-bs-toggle="modal"
							data-bs-target="#create_parameter_group"
							><i class="fa-solid fa-square-plus"></i>
							Add Parameter Group
						</button>
					</div>
				</div>
			</div>
			<div style="max-height: {$inerHight};" class="card-body table-responsive p-0">
				<table class="table table-bordered">
					<thead class="table-light table-active sticky-top">
						<tr>
							<th class="text-center" style="width: 5%;">N</th>
							<th>Parameter Group</th>
							<th>Parameter</th>
							<th>Lab Group</th>
							<th>Price</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{#each get_product_labo as item, index}
							<tr>
								<td class="text-center">{index + 1}</td>
								<td style="width: 30%;">{item.products}</td>
								<td style="width: 15%;">
									<a href="/settup/parameter/{item.id}" class="btn btn-primary btn-sm"
										>{item.parameter.length} <i class="fas fa-vial"></i>
									</a>
									<a
										on:click={() => {
											product_lab_id = 0;
											product_lab_id = item.id;
											create_summernote();
										}}
										href={'#'}
										type="button"
										class="btn btn-light btn-sm"
										data-bs-toggle="modal"
										data-bs-target="#create_parameter"
										><i class="fa-solid fa-square-plus"></i>
									</a>
								</td>
								<td style="width: 30%;">{item.laboratoryGroup?.laboratory_group}</td>
								<td style="width: 10%;">{new Intl.NumberFormat().format(item.price)}</td>
								<td style="width: 15%;">
									<button
										on:click={() => {
											product_lab_id = 0;
											product_lab_id = item.id;
										}}
										type="button"
										class="btn btn-primary btn-sm"
										data-bs-toggle="modal"
										data-bs-target="#create_parameter_group"
										><i class="fa-solid fa-file-pen"></i>
									</button>
									<button
										on:click={() => {
											product_lab_id = 0;
											product_lab_id = item.id;
										}}
										type="button"
										class="btn btn-danger btn-sm"
										data-bs-toggle="modal"
										data-bs-target="#delete_modal"
										><i class="fa-solid fa-trash-can"></i>
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
