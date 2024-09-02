<script lang="ts">
	import type { PageServerData } from '../../routes/(dash)/ipd/[progress_note_id]/progress-note/$types';
	import Athtml from '$lib/coms/Athtml.svelte';
	type TVisit = Pick<PageServerData, 'visit'>;
	type VisitProperties = TVisit['visit'] extends undefined ? never : TVisit['visit'];
	export let find_old_visit: VisitProperties;
	$: sort_laboraytor = find_old_visit?.laboratoryRequest.sort((a) => {
		if (a.product?.products.includes('CBC')) return -1;
		else return 1;
	});
</script>

<div class="">
	{#if sort_laboraytor?.length}
		<button class="btn btn-success btn-sm mb-2 py-0">Laboratory</button>
	{/if}
	{#each sort_laboraytor || [] as laboratory_request (laboratory_request.id)}
		{@const laboratory_results = laboratory_request.laboratoryResult}
		{@const parameters = laboratory_request.product?.parameter}
		<div class="border rounded border-1 p-2 mb-2">
			<span class="fs-6 text-decoration-underline text-primary"
				>{laboratory_request.product?.products ?? ''}</span
			>
			<table class="table-sm table">
				<thead>
					{#each parameters || [] as parameter (parameter.id)}
						<tr>
							<td style="width: 40%;"> {parameter.parameter ?? ''}</td>
							<td style="width: 5%;">:</td>
							{#each laboratory_results as laboratory_result (laboratory_result.id)}
								{#if laboratory_result.parameter_id === parameter.id}
									<td style="width: 20%;">
										{#if laboratory_result.result === 'Positive' || laboratory_result.result === '1/160' || laboratory_result.result === '1/320' || laboratory_result.result === '+' || laboratory_result.result === '++' || laboratory_result.result === '+++' || laboratory_result.result === '++++'}
											<span style="color: #FF0000;">
												{laboratory_result.result}
											</span>
										{:else if Number(laboratory_result.result) >= Number(parameter?.mini) && Number(laboratory_result.result) <= Number(parameter?.maxi)}
											<span>{laboratory_result.result}</span>
										{:else if Number(laboratory_result.result) < Number(parameter?.mini)}
											<span style="color: #0000FF;">{laboratory_result.result} L</span>
										{:else if Number(laboratory_result.result) > Number(parameter?.maxi)}
											<span style="color: #FF0000;">{laboratory_result.result} H</span>
										{:else}
											<span style="color: #0000FF;">
												{laboratory_result.result ?? ''}
											</span>
										{/if}
									</td>
								{/if}
							{/each}

							<td style="width: 15%;">
								<Athtml html={parameter.unit?.unit ?? ''} />
							</td>

							<td style="width: 20%;">
								{parameter.mini === 0 ? '' : `( ${parameter.mini}`}
								{parameter.sign ?? ''}
								{parameter.maxi === 0 ? '' : `${parameter.maxi} )`}
							</td>
						</tr>
					{/each}
				</thead>
			</table>
		</div>
	{/each}
	{#if find_old_visit?.imagerieRequest.length}
		<div class="border rounded border-1 p-2 mb-2">
			<span class="btn btn-success btn-sm mb-2 py-0">Imagerie</span>
			<table class="table table-sm">
				<thead>
					{#each find_old_visit?.imagerieRequest as imagerie_request (imagerie_request.id)}
						<tr>
							<td style="width: 40%;">
								<span class="">{imagerie_request.product?.products ?? ''}</span>
							</td>
							<td style="width: 5%;">:</td>
							<td style="width: 55%;">
								<a target="_blank" class="" href="/report/{imagerie_request.id}/imagerie">View</a>
							</td>
						</tr>
					{/each}
				</thead>
			</table>
		</div>
	{/if}
</div>
