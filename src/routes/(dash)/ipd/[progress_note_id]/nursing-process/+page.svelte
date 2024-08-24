<script lang="ts">
	import CreateNursingProcess from '$lib/coms-cu/CreateNursingProcess.svelte';
	import DeleteModal from '$lib/coms/DeleteModal.svelte';
	import type { PageServerData } from './$types';
	export let data: PageServerData;
	let nursing_process_id: number;
	$: ({ get_nursing_process } = data);
</script>

<CreateNursingProcess {data} {nursing_process_id} />
<DeleteModal action="?/delete_nursing_process" id={nursing_process_id} />
<!-- VitalSign  -->

<div class="card">
	<div class="card-header fs-5">
		<div class="row">
			<div class="col">
				<span># Nursing Process</span>
			</div>
			<div class="col-auto">
				<button
					on:click={() => (nursing_process_id = 0)}
					type="button"
					class="btn btn-success btn-sm"
					data-bs-toggle="modal"
					data-bs-target="#create_nursing_process"
					><i class="fa-solid fa-square-plus"></i>
					Nursing Process
				</button>
			</div>
		</div>
	</div>
	<div class="card-body table-responsive p-0">
		<table class="table table-bordered table-sm">
			<thead class="">
				<tr class="text-center">
					<th>Date</th>
					<th>Time</th>
					<th>Accessment</th>
					<th>Health Problems</th>
					<th>Actions</th>
					<th>Evolution</th>
					<th>Nursing Sign</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each get_nursing_process as item}
					<tr class="text-center">
						<td
							>{new Intl.DateTimeFormat('en-GB', { dateStyle: 'short' }).format(
								new Date(item?.datetime ?? '')
							)}</td
						>
						<td
							>{new Intl.DateTimeFormat('en-GB', { timeStyle: 'short', hour12: true }).format(
								new Date(item?.datetime ?? '')
							)}</td
						>
						<td>{item.accessment ?? ''}</td>
						<td>{item.health_problems ?? ''}</td>
						<td>{item.actions ?? ''}</td>
						<td>{item.evolution ?? ''}</td>
						<td>{item.nursing_sign ?? ''}</td>
						<td>
							<div>
								<button
									class="btn btn-primary btn-sm"
									type="button"
									data-bs-toggle="modal"
									data-bs-target="#create_nursing_process"
									on:click={() => {
										nursing_process_id = 0;
										nursing_process_id = item.id;
									}}
									><i class="fa-solid fa-file-pen"></i>
								</button>
								<button
									class="btn btn-danger btn-sm"
									type="button"
									data-bs-toggle="modal"
									data-bs-target="#delete_modal"
									on:click={() => {
										nursing_process_id = 0;
										nursing_process_id = item.id;
									}}
									><i class="fa-solid fa-trash-can"></i>
								</button>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
