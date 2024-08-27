<script lang="ts">
	import CreateVitalSignIpd from '$lib/coms-cu/CreateVitalSignIPD.svelte';
	import DateTimeFormat from '$lib/coms/DateTimeFormat.svelte';
	import DeleteModal from '$lib/coms/DeleteModal.svelte';
	import type { PageServerData } from './$types';
	export let data: PageServerData;
	let vital_sign_id: number;
	$: ({ get_vital_sing_ipd } = data);
</script>

<CreateVitalSignIpd {data} {vital_sign_id} />
<DeleteModal action="?/delete_vital_sign" id={vital_sign_id} />
<!-- VitalSign  -->

<div class="card">
	<div class="card-header fs-5">
		<div class="row">
			<div class="col">
				<span># Vital Sign</span>
			</div>
			<div class="col-auto">
				<button
					on:click={() => (vital_sign_id = 0)}
					type="button"
					class="btn btn-success btn-sm"
					data-bs-toggle="modal"
					data-bs-target="#create_vital_sign_ipd"
					><i class="fa-solid fa-square-plus"></i>
					Vital Sign
				</button>
			</div>
		</div>
	</div>
	<div class="card-body table-responsive p-0">
		<table class="table table-head-fixed table-bordered table-sm table-valign-middle">
			<thead class="">
				<tr class="text-center">
					<th>Date</th>
					<th>Time</th>
					<th>By</th>
					<th>BP (mmHg)</th>
					<th>Pulse (min)</th>
					<th>T (C)</th>
					<th>RR</th>
					<th>SpO2 (%)</th>
					<th>WG (kg)</th>
					<th>Piv</th>
					<th>Drink</th>
					<th>NG_in</th>
					<th>NG_out</th>
					<th>Fluid_out</th>
					<th>Vomiting</th>
					<th>Stool</th>
					<th>Urine</th>
					<th>Note</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each get_vital_sing_ipd as item}
					<tr class="text-center">
						<td>
							<DateTimeFormat timeStyle={false} date={item.datetime} />
						</td>
						<td>
							<DateTimeFormat dateStyle={false} date={item.datetime} />
						</td>
						<td>{item.by ?? ''}</td>
						<td
							>{item.sbp?.toFixed(0).concat(' /') ?? ''}
							{item.dbp?.toFixed(0).concat(' mmHg') ?? ''}</td
						>
						<td>{item.pulse ?? ''}</td>
						<td>{item.t ?? ''}</td>
						<td>{item.rr ?? ''}</td>
						<td>{item.sp02 ?? ''}</td>
						<td>{item.weight ?? ''}</td>
						<td>{item.piv ?? ''}</td>
						<td>{item.drink ?? ''}</td>
						<td>{item.nasogastric_tube_in ?? ''}</td>
						<td>{item.nasogastric_tube_out ?? ''}</td>
						<td>{item.fluid_out ?? ''}</td>
						<td>{item.vomiting ?? ''}</td>
						<td>{item.stool ?? ''}</td>
						<td>{item.urine ?? ''}</td>
						<td class="text-left">{item.note ?? ''}</td>
						<td>
							<div>
								<button
									class="btn btn-primary btn-sm"
									type="button"
									data-bs-toggle="modal"
									data-bs-target="#create_vital_sign_ipd"
									on:click={() => {
										vital_sign_id = 0;
										vital_sign_id = item.id;
									}}
									><i class="fa-solid fa-file-pen"></i>
								</button>
								<button
									class="btn btn-danger btn-sm"
									type="button"
									data-bs-toggle="modal"
									data-bs-target="#delete_modal"
									on:click={() => {
										vital_sign_id = 0;
										vital_sign_id = item.id;
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
