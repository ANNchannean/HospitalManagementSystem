<script lang="ts">
	import { enhance } from '$app/forms';
	import Athtml from '$lib/components/etc/Athtml.svelte';
	import DeleteModal from '$lib/components/etc/DeleteModal.svelte';
	import Select from '$lib/components/etc/Select.svelte';
	import SubmitButton from '$lib/components/etc/SubmitButton.svelte';
	import TextEditorA4 from '$lib/components/etc/TextEditorA4.svelte';
	import { inerHight } from '$lib/store';
	import type { PageServerData } from './$types';
	export let data: PageServerData;
	$: ({ get_form_document, get_patients } = data);
	let loading = false;
	let form_document_id = 0;
	let value: any;
	$: find_form_document = get_form_document.find((e) => e.id === form_document_id);
	$: find_patient = get_patients.find((e) => e.id === Number(value));
</script>

<DeleteModal action="?/delete_document" id={form_document_id} />
<div class="row">
	<div class="col-sm-6">
		<h2 class="">Document List</h2>
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
				<a href="/document" class="btn btn-link p-0 text-secondary"
					><i class="nav-icon fas fa-file"></i>
					Document
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
							on:click={() => (form_document_id = 0)}
							type="button"
							class="btn btn-success"
							data-bs-toggle="modal"
							data-bs-target="#create_document"
							><i class="fa-solid fa-square-plus"></i>
							New Document
						</button>
					</div>
				</div>
			</div>

			<div style="max-height: {$inerHight};" class="card-body table-responsive p-0">
				<table class="table table-bordered">
					<thead class="table-active table-light sticky-top">
						<tr>
							<th class="text-center" style="width: 5%;">N</th>
							<th style="width: 20%;">Tittle</th>
							<th style="width: 40%;">Document</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody class="">
						{#each get_form_document || [] as item, index}
							<tr>
								<td class="text-center">{index + 1}</td>

								<td>
									{item.title}
								</td>
								<td>
									<a
										href={'#'}
										type="button"
										on:click={() => {
											form_document_id = 0;
											form_document_id = item.id;
										}}
										class="btn btn-light btn-sm text-end"
										data-bs-toggle="modal"
										data-bs-target="#view_document"
										><i class="fa-regular fa-folder-open"></i>
									</a>
								</td>
								<td>
									<div>
										<a
											href={'#'}
											on:click={() => {
												form_document_id = 0;
												form_document_id = item.id;
											}}
											type="button"
											class="btn btn-primary btn-sm text-end"
											data-bs-toggle="modal"
											data-bs-target="#create_document"
											><i class="fa-solid fa-file-pen"></i>
										</a>
										<a
											href={'#'}
											on:click={() => {
												form_document_id = 0;
												form_document_id = item.id;
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

<div class="modal fade" id="view_document">
	<div class="modal-dialog modal-fullscreen">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title">Document</h4>
				<button
					on:click={() => (form_document_id = 0)}
					type="button"
					class="btn-close"
					data-bs-dismiss="modal"
					aria-label="Close"
				>
				</button>
			</div>
			<div class="modal-body">
				<div class="col-12">
					<div class="row justify-content-center">
						<div style="width: 50%;">
							<table class="super-table">
								<tbody>
									<tr>
										<td>
											<div class="row">
												<Athtml
													html={get_form_document.find((e) => e.id === form_document_id)?.content ??
														''}
												/>
											</div>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="modal fade" id="create_document">
	<div class="modal-dialog modal-xl">
		<form
			enctype="multipart/form-data"
			action="?/create_document"
			use:enhance={() => {
				loading = true;
				return async ({ update, result }) => {
					await update();
					loading = false;
					if (result.type !== 'failure') {
						document.getElementById('close_document')?.click();
					}
				};
			}}
			method="post"
			class="modal-content"
		>
			<input type="hidden" name="id" value={form_document_id ?? ''} />
			<div class="modal-header">
				<h4 class="modal-title">Document</h4>
				<button
					id="close_document"
					type="button"
					class="btn-close"
					data-bs-dismiss="modal"
					aria-label="Close"
				>
				</button>
			</div>
			<div class="modal-body">
				<label for="title">Title</label>
				<input
					value={find_form_document?.title ?? ''}
					class="form-control mb-3"
					type="text"
					name="title"
					id="title"
				/>
				<TextEditorA4
					setValue={find_form_document?.content ?? ''}
					name="content"
					id="document"
					height={600}
				/>
			</div>
			<div class="modal-footer justify-content-end">
				<!-- <button type="button" class="btn btn-default" data-bs-dismiss="modal">Close</button> -->
				<SubmitButton {loading} />
			</div>
		</form>
	</div>
</div>
