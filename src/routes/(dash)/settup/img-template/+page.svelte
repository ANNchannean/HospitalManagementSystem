<script lang="ts">
	import type { ActionData, PageServerData } from './$types';
	import DeleteModal from '$lib/components/DeleteModal.svelte';
	import RichText from '$lib/components/RichText.svelte';
	import CreateTemplate from '$lib/components/createORupdate/CreateTemplate.svelte';
	import { browser } from '$app/environment';
	import { inerHight } from '$lib/store';
	export let data: PageServerData;
	export let form: ActionData;
	let template_id: number;
	$: ({ get_templates } = data);
	$: find_template = get_templates.find((e) => e.id === template_id);
	function create_summernote(id: string) {
		if (browser) {
			const jQuery = (window as any).$;
			jQuery(document).ready(function () {
				jQuery(`#${id}`).summernote({
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
					height: 400
				});
			});
		}
	}
</script>

<CreateTemplate {data} {form} {template_id} />
<RichText {data} {template_id} />
<DeleteModal action="?/delete_template" id={find_template?.id} />

<div class="row">
	<div class="col-sm-6">
		<h2>Template</h2>
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
				<a href="/settup/img-template" class="btn btn-link p-0 text-secondary"
					><i class="fas fa-sticky-note nav-icon"></i>
					Imagerie Template
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
								template_id = 0;
								create_summernote('summernote');
							}}
							type="button"
							class="btn btn-success"
							data-bs-toggle="modal"
							data-bs-target="#create_template"
							><i class="fa-solid fa-square-plus"></i>
							Add Template
						</button>
					</div>
				</div>
			</div>
			<div style="max-height: {$inerHight};" class="card-body table-responsive p-0">
				<table class="table table-bordered">
					<thead class="table-active table-light sticky-top">
						<tr>
							<th class="text-center" style="width: 5%;">N</th>
							<th style="width: 40%;">Diagnosis</th>
							<th style="width: 10%;">Template</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody class="">
						{#each get_templates || [] as item, index}
							<tr>
								<td class="text-center">{index + 1}</td>
								<td>
									{item.diagnosis}
								</td>
								<td>
									<a
										href={'#'}
										on:click={() => {
											template_id = 0;
											template_id = item.id;
											create_summernote('template-view');
										}}
										type="button"
										class="btn btn-light btn-sm text-end"
										data-bs-toggle="modal"
										data-bs-target="#template_view"
										><i class="fa-regular fa-folder-open"></i>
									</a>
								</td>
								<td>
									<div>
										<a
											href={'#'}
											on:click={() => {
												template_id = 0;
												template_id = item.id;
												create_summernote('summernote');
											}}
											type="button"
											class="btn btn-primary btn-sm text-end"
											data-bs-toggle="modal"
											data-bs-target="#create_template"
											><i class="fa-solid fa-file-pen"></i>
										</a>
										<a
											href={'#'}
											on:click={() => {
												template_id = 0;
												template_id = item.id;
											}}
											type="button"
											class="btn btn-danger btn-sm text-end"
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
