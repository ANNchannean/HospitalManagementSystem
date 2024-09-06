<script lang="ts">
	import DeleteModal from '$lib/coms/DeleteModal.svelte';
	import UpdateParameter from '$lib/coms-cu/UpdateParameter.svelte';
	import { inerHight } from '$lib/store';
	import type { ActionData, PageServerData } from './$types';
	import Athtml from '$lib/coms/Athtml.svelte';
	export let form: ActionData;
	export let data: PageServerData;
	let parameter_id: number;
	$: ({ get_parameters, get_product_labo, get_units } = data);
	$: find_parameter = get_parameters.filter((e) => e.id === parameter_id);
</script>

<DeleteModal action="?/delete_parameter" id={find_parameter[0]?.id} />
<UpdateParameter
	data={{
		get_units: get_units,
		get_parameters: find_parameter
	}}
	{form}
	bind:parameter_id
/>

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
	<div class="card-header fs-4">
		<span>Parameter Group ID#{get_product_labo?.id ?? ''} </span>
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
								<Athtml html={item.description ?? ''} />
							</td>
							<td class="text-center"><Athtml html={item?.unit?.unit ?? ''} /> </td>
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
