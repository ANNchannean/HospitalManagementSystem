<script lang="ts">
	import type { PageServerData } from './$types';
	import CreateVitalSign from '$lib/coms-cu/CreateVitalSign.svelte';
	import SubmitButton from '$lib/coms/SubmitButton.svelte';
	import { enhance } from '$app/forms';
	import { slide } from 'svelte/transition';
	import Athtml from '$lib/coms/Athtml.svelte';
	import Words from '$lib/coms-cu/Words.svelte';
	import { onMount } from 'svelte';
	import { globalLoading } from '$lib/store';
	import { invalidateAll } from '$app/navigation';
	export let data: PageServerData;
	let loading = false;
	$: ({ get_exams, get_visit, get_words } = data);
	const { get_physicals } = data;
	let physicalExam_name = '';
	$: mean_arterial_pressure =
		(1 / 3) * Number(get_visit?.vitalSign?.sbp) + (2 / 3) * Number(get_visit?.vitalSign?.dbp);
	const obj: any = {};
	onMount(() => {
		for (let index = 0; index < get_physicals?.length; index++) {
			const element = get_physicals[index];
			obj[element.id] =
				get_visit?.physicalExam.find((e) => e.physical_id === element.id)?.result ?? '';
		}
	});
</script>

<CreateVitalSign
	data={{
		get_visit: get_visit
	}}
/>
<!-- VitalSign  -->

<div class="card">
	<div class="card-header">
		<div class="row">
			<div class="col fs-5">
				<span># Vital Sign</span>
			</div>
			<div class="col-auto">
				<button
					type="button"
					class="btn btn-success btn-sm"
					data-bs-toggle="modal"
					data-bs-target="#create_vital_sign"
					><i class="fa-solid fa-square-plus"></i>
					Vital Sign
				</button>
			</div>
		</div>
	</div>
	<div class="card-body table-responsive p-0">
		<table class="table text-nowrap">
			<thead class="">
				<tr>
					<th class="text-center">BP(mmHg)</th>
					<th class="text-center">MAP</th>
					<th class="text-center">Pulse (min)</th>
					<th class="text-center"><Athtml html={'Temperature &deg;C'} /></th>
					<th class="text-center">RR (min)</th>
					<th class="text-center">SpO2 (%)</th>
					<th class="text-center">Height (cm)</th>
					<th class="text-center">Weight (kg)</th>
					<th class="text-center">BMI</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="text-center"
						>{get_visit?.vitalSign?.sbp?.toFixed(0).concat(' /') ?? ''}
						{get_visit?.vitalSign?.dbp?.toFixed(0).concat(' mmHg') ?? ''}
					</td>
					<td class="text-center"
						>{mean_arterial_pressure ? mean_arterial_pressure?.toFixed(0).concat(' mmHg') : ''}</td
					>
					<td class="text-center"
						>{get_visit?.vitalSign?.pulse?.toFixed(0).concat(' /min') ?? ''}</td
					>
					<td class="text-center"
						><Athtml html={get_visit?.vitalSign?.t?.toFixed(1).concat(' &deg;C') ?? ''} /></td
					>
					<td class="text-center">{get_visit?.vitalSign?.rr?.toFixed(0).concat(' /min') ?? ''}</td>
					<td class="text-center">{get_visit?.vitalSign?.sp02?.toFixed(0).concat(' %') ?? ''}</td>
					<td class="text-center">{get_visit?.vitalSign?.height?.toFixed(0).concat(' cm') ?? ''}</td
					>
					<td class="text-center">{get_visit?.vitalSign?.weight?.toFixed(0).concat(' kg') ?? ''}</td
					>
					<td class="text-center">{get_visit?.vitalSign?.bmi?.toFixed(1).concat(' kg/m2') ?? ''}</td
					>
				</tr>
			</tbody>
		</table>
	</div>
</div>

<!-- physical  -->
<br />
<div class="card card-info">
	<div class="card-header fs-5">
		<span># Physical Exam</span>

		<!-- Default dropleft button -->
	</div>

	<div class="card-body">
		<div class="form-group row">
			<div class="col-sm-12">
				{#each get_exams as item, index}
					<button
						on:click={() => {
							if (physicalExam_name === item.examination) {
								physicalExam_name = '';
							} else {
								physicalExam_name = item.examination ?? '';
							}
						}}
						type="button"
						class={physicalExam_name === item.examination
							? 'btn w-100 btn-light  d-flex align-items-start '
							: 'btn w-100 btn-light my-2  d-flex align-items-start'}
					>
						&nbsp;{index + 1}&nbsp;
						{#if physicalExam_name === item.examination}
							<span><i class="fas fa-angle-down"></i></span>
						{/if}
						{#if physicalExam_name !== item.examination}
							<span><i class="fas fa-angle-right"></i></span>
						{/if}
						&nbsp;{item?.examination}</button
					>

					{#if physicalExam_name === item.examination}
						<div class="pb-2" in:slide={{ duration: 300 }} out:slide={{ duration: 300 }}>
							{#if item.physical.length}
								<form
									data-bs-sveltekit-noscroll
									method="post"
									action="?/exam_result"
									class="bg-light py-3"
									use:enhance={() => {
										loading = true;
										$globalLoading = true;
										return async ({ update, result }) => {
											await update({ reset: false });
											loading = false;
											$globalLoading = false;
											if (result.type !== 'failure') {
												invalidateAll();
											}
										};
									}}
								>
									<div class="row px-4 pt-2">
										{#each item.physical as element}
											{@const exam_result = get_visit?.physicalExam.find(
												(e) => e.physical_id === element.id
											)}

											<input type="hidden" name="physical_id" value={element?.id ?? ''} />
											<input type="hidden" name="physical_exam_id" value={exam_result?.id ?? ''} />
											<div class="col-6">
												<Words
													bind:value={obj[element.id]}
													Class="btn btn-link"
													name={element.physical ?? ''}
													words={get_words.filter(
														(e) =>
															e.type ===
															element.physical
																?.replaceAll(' ', '_')
																.replaceAll('/', '_')
																.replaceAll("'", '_')
																.concat(element.id.toString())
													)}
													modal_name={element.physical
														?.replaceAll(' ', '_')
														.replaceAll('/', '_')
														.replaceAll("'", '_')
														.concat(element.id.toString()) ?? ''}
												/>
												<!-- <p class="pb-0 mb-0">{element?.physical ?? ''}</p> -->
												<input
													bind:value={obj[element.id]}
													name="physical"
													class="form-control"
													type="text"
												/>
											</div>
										{/each}
									</div>

									<div class=" px-4 pb-2 pt-2 d-grid gap-2 d-md-flex justify-content-md-end">
										<SubmitButton {loading} />
									</div>
								</form>
							{/if}
						</div>
					{/if}
				{/each}
			</div>
		</div>
	</div>
</div>
