<script lang="ts">
	import DeleteModal from '$lib/components/etc/DeleteModal.svelte';
	import { browser } from '$app/environment';
	export let parameters_data: any[];
	export let parameter_data: any;
	let parameter_id: undefined;
	function create_summernote() {
		if (browser) {
			const jQuery = (window as any).$;
			jQuery(document).ready(function () {
				// jQuery('select').selectpicker();
				jQuery('#summernote1').summernote({
					toolbar: [
						// [groupName, [list of button]]
						['style', ['bold', 'italic', 'underline', 'clear']],
						['font', ['strikethrough', 'superscript', 'subscript']],
						['fontsize', ['fontsize']],
						['color', ['color']],
						['para', ['ul', 'ol', 'paragraph']],
						['height', ['height']]
					],
					tabsize: 2,
					height: 200
				});
			});
		}
	}
</script>

{#if parameter_id}
	<DeleteModal id={parameter_id} action="?/delete_parameter" />
{/if}
<!-- @_List_Parameter -->
<div class="modal fade" id="modal-list-parameter" data-bs-backdrop="static">
	<div class="modal-dialog modal-xl">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title">List Paramater</h4>
				<button
					id="close_parameter"
					type="button"
					class="btn-close"
					data-bs-dismiss="modal"
					aria-label="Close"
				>
				</button>
			</div>
			<div class="modal-body">
				<div class="card-body table-responsive p-0">
					<table class="table table-head-fixed text-nowrap">
						<thead class="">
							<tr>
								<th>N</th>
								<th>Parameter</th>
								<th>Description</th>
								<th>Unit</th>
								<th>Gender</th>
								<th>Mini</th>
								<th>Maxi</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{#each parameters_data || [] as item, index}
								<tr>
									<td>{index + 1}</td>
									<td>{item?.parameter}</td>
									<td>
										<a
											href={'#'}
											on:click={() => {
												parameter_id = undefined;
												parameter_data = undefined;
												parameter_data = item;
												parameter_id = item?.id;
												document.getElementById('close_parameter')?.click();
											}}
											type="button"
											class="btn btn-default btn-sm"
											data-bs-toggle="modal"
											data-bs-target="#update_parameter"
											><i class="fa-solid fa-comments"></i>
										</a>
									</td>
									<td>{item?.unit?.unit}</td>
									<td>{item?.gender}</td>
									<td>{item?.mini}</td>
									<td>{item?.maxi}</td>
									<td>
										<div>
											<a
												href={'#'}
												on:click={() => {
													parameter_id = undefined;
													parameter_data = undefined;
													parameter_data = item;
													parameter_id = item?.id;
													document.getElementById('close_parameter')?.click();
													create_summernote();
												}}
												type="button"
												class="btn btn-info btn-sm"
												data-bs-toggle="modal"
												data-bs-target="#update_parameter"
												><i class="fa-solid fa-file-pen"></i>
											</a>
											<a
												href={'#'}
												on:click={() => {
													parameter_id = undefined;
													parameter_id = item?.id;
													document.getElementById('close_parameter')?.click();
												}}
												type="button"
												class="btn btn-danger btn-sm"
												data-bs-toggle="modal"
												data-bs-target="#delete_modal"
												><i class="fa-solid fa-trash-can"></i>
											</a>
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>
