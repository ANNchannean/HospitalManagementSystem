<script lang="ts">
	import type { PageServerData } from './$types';
	import type { EventHandler } from 'svelte/elements';
	import { inerHight } from '$lib/store';
	export let data: PageServerData;
	$: ({ get_prescriptions } = data);
	let timeout: number | NodeJS.Timeout;
	const handleQ: EventHandler<Event, HTMLInputElement> = ({ currentTarget }) => {
		clearTimeout(timeout);
		const form = currentTarget?.form;
		if (!form) return;
		timeout = setTimeout(() => {
			form.requestSubmit();
		}, 400);
	};
</script>

<div class="row">
	<div class="col-sm-6">
		<h2>prescription</h2>
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
				<a href="/prescription" class="btn btn-link p-0 text-secondary"
					><i class="fas fa-prescription nav-icon"></i>
					Prescription
				</a>
			</li>
		</ol>
	</div>
</div>
<div class="row">
	<div class="col-12">
		<div class="card card-default">
			<div class="card-header">
				<div class="row">
					<div class="col">
						<input
							on:input={handleQ}
							type="search"
							name="q"
							class="form-control float-right"
							placeholder="Search"
						/>
					</div>
				</div>
			</div>
			<div style="max-height: {$inerHight};" class="card-body table-responsive p-0">
				<table class="table table-hover table-head-fixed text-nowrap table-valign-middle">
					<thead class="">
						<tr>
							<th>N</th>
							<th>Medcine</th>
							<th>Use</th>
							<th>Duration</th>
							<th>Amount</th>
							<th></th>
						</tr>
					</thead>
					<tbody class="table-sm">
						{#each get_prescriptions as item, index}
							<tr>
								<td>{index + 1}</td>
								<td>{item.product?.products}</td>
								<td>{item.use ?? ''}</td>
								<td>{item.duration ?? ''}</td>
								<td>{item.amount}</td>
								<td>
									<!-- <div>
												<a
													href={'#'}
													on:click={() => {
														prescription_lenght = 0.1;
														prescription_lenght = index;
													}}
													type="button"
													class="btn btn-default btn-sm"
													data-bs-toggle="modal"
													data-bs-target="#create_prescription"
													><i class="fa-solid fa-file-pen"></i>
												</a>
												<a
													href={'#'}
													on:click={() => {
														prescription_lenght = 0.1;
														prescription_lenght = index;
													}}
													type="button"
													class="btn btn-default btn-sm"
													data-bs-toggle="modal"
													data-bs-target="#delete_modal"
													><i class="fa-solid fa-trash-can"></i>
												</a>
											</div> -->
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
