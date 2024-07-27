<script lang="ts">
	import { browser } from '$app/environment';

	import DeleteModal from '$lib/components/DeleteModal.svelte';
	import UpdateParameter from '$lib/components/createORupdate/UpdateParameter.svelte';
	import { inerHight } from '$lib/store';
	import type { ActionData, PageServerData } from './$types';
	export let form: ActionData;
	export let data: PageServerData;
	let parameter_id: number;
	$: ({ get_parameters, get_product_labo } = data);
	$: find_parameter = get_parameters.find((e) => e.id === parameter_id);

	function create_summernote() {
		if (browser) {
			const $ = (window as any).$;
			$(document).ready(function () {
				$('#summernote').summernote({
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

<DeleteModal action="?/delete_parameter" id={find_parameter?.id} />
<UpdateParameter {data} {form} {parameter_id} />

<div class="row">
	<div class="col-sm-6">
		<h2>
			<a href="/settup/parameter/group" class="btn btn-link p-0 text-secondary"
				><i class="fa-solid fa-rotate-left"></i>
				Back
			</a>
		</h2>
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
			<li class="breadcrumb-item">
				<a href={'#'} class="btn btn-link p-0 text-secondary"
					><i class="fa-solid fa-vials"></i>
					Parameter
				</a>
			</li>
		</ol>
	</div>
</div>

<div class="card">
	<div class="card-header bg-info">
		<h4 class="card-title">
			<span>Parameter Group ID#{get_product_labo?.id ?? ''} </span>
		</h4>
	</div>
	<div class="form-horizontal">
		<div style="max-height: {$inerHight};" class="card-body table-responsive p-0">
			<table class="table table-bordered">
				<thead class="table-active table-light sticky-top">
					<tr>
						<th class="text-center" style="width: 5%;">N</th>
						<th>Parameter</th>
						<th>Description</th>
						<th class="text-center">Unit</th>
						<th class="text-center">Gender</th>
						<th class="text-center">Range Normal</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{#each get_parameters || [] as item, index}
						<tr>
							<td class="text-center">{index + 1}</td>
							<td>{item?.parameter ?? ''}</td>
							<td>
								{@html item.description}
							</td>
							<td class="text-center">{@html item?.unit?.unit ?? ''} </td>
							<td class="text-center">{item?.gender ?? ''}</td>
							<td class="text-center">
								<div>
									<span>
										{item?.mini === 0 ? '' : item.mini}
									</span>
									<span>
										{item.sign ?? ''}
									</span>
									<span>
										{item?.maxi === 0 ? '' : item.maxi}
									</span>
								</div>
							</td>
							<td>
								<button
									on:click={() => {
										parameter_id = 0;
										parameter_id = item.id;
										create_summernote();
									}}
									type="button"
									class="btn btn-primary btn-sm"
									data-bs-toggle="modal"
									data-bs-target="#update_parameter"
									><i class="fa-solid fa-file-pen"></i>
								</button>
								<button
									on:click={() => {
										parameter_id = 0;
										parameter_id = item.id;
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
