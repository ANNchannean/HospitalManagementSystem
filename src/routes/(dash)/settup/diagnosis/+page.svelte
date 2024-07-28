<script lang="ts">
	import type { EventHandler } from 'svelte/elements';
	import type { PageServerData } from './$types';
	import { inerHight } from '$lib/store';
	export let data: PageServerData;
	$: ({ get_diagonosis, get_diagnosis_group } = data);
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
		<h2>List Diagnosis</h2>
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
				<a href="/settup/diagnosis" class="btn btn-link p-0 text-secondary"
					><i class="fa-solid fa-comment-medical nav-icon"></i>
					Diagnosis
				</a>
			</li>
		</ol>
	</div>
</div>

<div class="row">
	<div class="col-12">
		<div class="card">
			<div class="card-header">
				<form
					data-bs-sveltekit-keepfocus
					on:change={(e) => e.currentTarget.requestSubmit()}
					class="row"
				>
					<div class="col-3">
						<select id="diagnosis_type_id" class="form-control" name="diagnosis_type_id">
							<option value="">DiagnosisGroup</option>
							{#each get_diagnosis_group as item}
								<option value={item.id}>{item.diagnosis_type}</option>
							{/each}
						</select>
					</div>
					<div class="col-auto">
						<input
							on:input={handleQ}
							type="search"
							name="q"
							class="form-control float-right"
							placeholder="Search"
						/>
					</div>
				</form>
			</div>
			<div style="max-height: {$inerHight};" class="card-body table-responsive p-0">
				<table class="table table-bordered">
					<thead class="table-active table-light sticky-top">
						<tr>
							<th class="text-center" style="width: 5%;">N</th>
							<th>Diagnosis</th>
							<th>DiagnosisKhmer</th>
							<th>TypeDiagnosis</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{#each get_diagonosis as item, index}
							<tr>
								<td class="text-center">{index + 1}</td>
								<td>{item.diagnosis ?? ''}</td>
								<td>{item.diagnosis_khmer ?? ''}</td>
								<td>{item.diagnosisType?.diagnosis_type ?? ''}</td>
								<td>
									<div>
										<a
											href={'#'}
											on:click={() => {}}
											type="button"
											class="btn btn-primary btn-sm"
											data-bs-toggle="modal"
											data-bs-target="#create-medicine"
											><i class="fa-solid fa-file-pen"></i>
										</a>
										<a
											href={'#'}
											on:click={() => {}}
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
