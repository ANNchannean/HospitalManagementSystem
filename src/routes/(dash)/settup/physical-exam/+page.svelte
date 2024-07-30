<script lang="ts">
	import type { ActionData, PageServerData } from './$types';
	import DeleteModal from '$lib/components/etc/DeleteModal.svelte';
	import CreateExam from '$lib/components/createORupdate/CreateExam.svelte';
	import CreatePhysical from '$lib/components/createORupdate/CreatePhysical.svelte';
	import UpdatePhysical from '$lib/components/createORupdate/UpdatePhysical.svelte';
	import { inerHight } from '$lib/store';
	export let data: PageServerData;
	export let form: ActionData;
	$: ({ get_examas } = data);
	$: find_exam = get_examas.find((e) => e.id === exam_id);
	let exam_id: number;
</script>

<UpdatePhysical {data} {exam_id} />
<CreatePhysical {data} {exam_id} />
<DeleteModal action="?/delete_exam" id={find_exam?.id} />
<CreateExam {data} {form} {exam_id} />

<div class="row">
	<div class="col-sm-6">
		<h2>Exam</h2>
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
				<a href="/settup/physical-exam" class="btn btn-link p-0 text-secondary"
					><i class="fas fa-book-open nav-icon"></i>
					Exam
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
							on:click={() => (exam_id = 0)}
							type="button"
							class="btn btn-success"
							data-bs-toggle="modal"
							data-bs-target="#create-exam"
							><i class="fa-solid fa-square-plus"></i>
							New Exam
						</button>
					</div>
				</div>
			</div>
			<div style="max-height: {$inerHight};" class="card-body table-responsive p-0">
				<table class="table table-bordered">
					<thead class="table-light table-active sticky-top">
						<tr>
							<th class="text-center" style="width: 5%;">N</th>
							<th>Examination</th>
							<th>Physical</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody class="table-sm">
						{#each get_examas || [] as item, index}
							<tr>
								<td class="text-center">{index + 1}</td>
								<td>{item.examination}</td>
								<td>
									<div>
										<a
											href={'#'}
											on:click={() => {
												exam_id = 0;
												exam_id = item.id;
											}}
											type="button"
											class="btn btn-light btn-sm"
											data-bs-toggle="modal"
											data-bs-target="#update-physical"
											>{item.physical.length} <i class="fa-regular fa-folder-open"></i>
										</a>
										<a
											href={'#'}
											on:click={() => {
												exam_id = 0;
												exam_id = item.id;
											}}
											type="button"
											class="btn btn-light btn-sm"
											data-bs-toggle="modal"
											data-bs-target="#create-physical"
											><i class="fa-solid fa-square-plus"></i>
										</a>
									</div>
								</td>
								<td>
									<div>
										<a
											href={'#'}
											on:click={() => {
												exam_id = 0;
												exam_id = item.id;
											}}
											type="button"
											class="btn btn-primary btn-sm"
											data-bs-toggle="modal"
											data-bs-target="#create-exam"
											><i class="fa-solid fa-file-pen"></i>
										</a>
										<a
											href={'#'}
											on:click={() => {
												exam_id = 0;
												exam_id = item.id;
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
