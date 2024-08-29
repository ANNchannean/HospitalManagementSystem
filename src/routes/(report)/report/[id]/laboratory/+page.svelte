<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageServerData } from './$types';
	import { dobToAge } from '$lib/helper';
	import Athtml from '$lib/coms/Athtml.svelte';
	import DateTimeFormat from '$lib/coms/DateTimeFormat.svelte';
	import ClinichInfo from '$lib/coms/ClinichInfo.svelte';
	import { page } from '$app/stores';
	export let data: PageServerData;
	$: ({ get_visit, removeDuplicateName, sort_laboraytor, get_clinic_info, get_imagers, url_qr } =
		data);

	$: age_p_visit = dobToAge({
		dob: get_visit?.patient.dob ?? '',
		date: get_visit?.date_checkup ?? ''
	});
	let isPrint = $page.url.searchParams.get('print');
	onMount(async () => {
		document.addEventListener('keydown', function (event) {
			window.scrollTo({ top: 0, behavior: 'smooth' });
			if (event.ctrlKey && event.key === 'p') {
				// event.preventDefault();
				// alert('View only');
			}
		});
		if (isPrint === 'true') {
			setTimeout(async () => {
				window.print();
				window.close();
			}, 300);
		}
	});
</script>

<div class="row pt-4 justify-content-center">
	<div style="width: 1200px;">
		<div class="header">
			<ClinichInfo {get_clinic_info} />
			<div class="border p-2 pb-0">
				<table class=" table table-sm table-borderless">
					<thead class="">
						<tr class="p-0 m-0">
							<td style="font-size: 110%;" class="text-bold en_font_times_new_roman p-0 m-0"
								>Khmer Name</td
							>
							<td class="p-0 m-0"> : </td>
							<td class="p-0 m-0">{get_visit?.patient?.name_khmer}</td>
							<td style="font-size: 110%;" class="text-bold en_font_times_new_roman p-0 m-0"
								>Gender</td
							>
							<td class="p-0 m-0"> : </td>
							<td class="p-0 m-0">{get_visit?.patient?.gender ?? ''}</td>
							<td style="font-size: 110%;" class="text-bold en_font_times_new_roman p-0 m-0">Lab</td
							>
							<td class="p-0 m-0"> : </td>
							<td class="p-0 m-0">{get_visit?.id ?? ''}</td>
						</tr>
						<tr class="p-0 m-0">
							<td style="font-size: 110%;" class="text-bold en_font_times_new_roman p-0 m-0"
								>Latin Name</td
							>
							<td class="p-0 m-0"> : </td>
							<td class="p-0 m-0">{get_visit?.patient?.name_latin}</td>
							<td style="font-size: 110%;" class="text-bold en_font_times_new_roman p-0 m-0">Age</td
							>
							<td class="p-0 m-0"> : </td>
							<td class="p-0 m-0">
								អាយុ {age_p_visit?.y} ឆ្នាំ ,
								{age_p_visit?.m} ខែ ,
								{age_p_visit?.d} ថ្ងៃ
							</td>
							<td style="font-size: 110%;" class="text-bold en_font_times_new_roman p-0 m-0"
								>Collection Date</td
							>
							<td class="p-0 m-0"> : </td>
							<td class="p-0 m-0">
								<DateTimeFormat date={get_visit?.date_checkup} />
							</td>
						</tr>
						<tr class="p-0 m-0">
							<td style="font-size: 110%;" class="text-bold en_font_times_new_roman p-0 m-0"
								>Requester</td
							>
							<td class="p-0 m-0"> : </td>
							<td class="p-0 m-0">{get_visit?.staff?.name ?? ''}</td>
							<td style="font-size: 110%;" class="text-bold en_font_times_new_roman p-0 m-0"
								>Etiology</td
							>
							<td class="p-0 m-0"> : </td>
							<td class="p-0 m-0">{get_visit?.etiology ?? ''}</td>
							<td style="font-size: 110%;" class="text-bold en_font_times_new_roman p-0 m-0"
								>Report Date</td
							>
							<td class="p-0 m-0"> : </td>
							<td class="p-0 m-0">
								{#if get_visit?.laboratory?.finish_datetime}
									<DateTimeFormat date={get_visit?.laboratory?.finish_datetime} />
								{/if}
							</td>
						</tr>
						<tr class="p-0 m-0">
							<td style="font-size: 110%;" class="text-bold en_font_times_new_roman p-0 m-0"
								>Phone</td
							>
							<td class="p-0 m-0"> : </td>
							<td style="font-size: 110%;" class="en_font_times_new_roman p-0 m-0"
								>{get_visit?.patient?.telephone ?? ''}</td
							>
							<td style="font-size: 110%;" class="text-bold en_font_times_new_roman p-0 m-0"
								>Visit</td
							>
							<td class="p-0 m-0"> : </td>
							<td style="font-size: 110%;" class="en_font_times_new_roman p-0 m-0"
								>{get_visit?.checkin_type ?? ''}</td
							>
							<td style="font-size: 110%;" class="text-bold en_font_times_new_roman p-0 m-0"
								>Sample</td
							>
							<td class="p-0 m-0"> : </td>
							<td style="font-size: 110%;" class="en_font_times_new_roman p-0 m-0"
								>{get_visit?.laboratory?.sample ?? ''}</td
							>
						</tr>
						<tr class="p-0 m-0">
							<td style="font-size: 110%;" class="text-bold en_font_times_new_roman p-0 m-0"
								>Address</td
							>
							<td class="p-0 m-0"> : </td>
							<td colspan="6" class="kh_font_battambang p-0 m-0">
								{get_visit?.patient?.village?.type ?? ''}
								{get_visit?.patient?.village?.name_khmer.concat(',') ?? ''}
								{get_visit?.patient?.commune?.type ?? ''}
								{get_visit?.patient?.commune?.name_khmer.concat(',') ?? ''}
								{get_visit?.patient?.district?.type ?? ''}
								{get_visit?.patient?.district?.name_khmer.concat(',') ?? ''}
								{get_visit?.patient?.provice?.type ?? ''}
								{get_visit?.patient?.provice?.name_khmer ?? ''}
							</td>
						</tr>
					</thead>
				</table>
			</div>
		</div>
		<table class="w-100">
			<thead>
				<div class="header-space">&nbsp;</div>
			</thead>
			<tbody>
				<u>
					<h1 style="font-size: 130%;" class="text-center kh_font_muol">លទ្ធផលមន្ទីរពិសោធន៍</h1>
					<h1 style="font-size: 100%;" class="text-center en_font_times_new_roman">
						Laboratory Result
					</h1>
				</u>
				{#each removeDuplicateName || [] as item_0 (item_0.id)}
					<table class="table text-wrap table-sm table-bordered p-0 m-0">
						<thead class="">
							<td class="text-center border" colspan="6">
								<span class="en_font_times_new_roman" style="font-size: 120%;color:#0000FF">
									{item_0.product?.laboratoryGroup?.laboratory_group ?? ''}</span
								></td
							>
							<tr style="font-size: 120%;" class="text-center en_font_times_new_roman">
								<th style="width: 5%;">N</th>
								<th style="width: 50%;">Parameter</th>
								<th style="width: 15%;">Result</th>
								<th style="width: 15%;">Unit</th>
								<th style="width: 15%;">Range Normal</th>
							</tr>
						</thead>
						<tbody class="table-sm">
							{#each sort_laboraytor || [] as item_1 (item_1.id)}
								{#if item_0.product?.laboratory_group_id === item_1.product?.laboratory_group_id}
									<tr>
										<td colspan="6">
											<b> &nbsp;&nbsp; #{item_1.product?.products}</b>
										</td>
									</tr>
									{#each item_1.laboratoryResult as item_2, index (item_2.id)}
										{@const check_result = item_2.result || ''}
										<tr class="text-center kh_font_battambang p-0 m-0">
											<td class="p-0 m-0">{index + 1}</td>
											<td class="text-start">
												<div class="p-0 m-0">
													<span style="font-size: 120%;" class="en_font_times_new_roman"
														>{item_2.parameter?.parameter}</span
													>
													<span>
														<Athtml html={item_2?.parameter?.description ?? ''} />
													</span>
													<!-- <span>
																				{@html browser ? item_2?.parameter?.description ?? '' : ''}
																			</span> -->
												</div>
											</td>
											<td style="font-size: 120%;" class="p-0 m-0 en_font_times_new_roman">
												{#if check_result === 'Positive' || check_result === '1/160' || check_result === '1/320' || check_result === '+' || check_result === '++' || check_result === '+++' || check_result === '++++'}
													<span style="color: #FF0000;">
														{item_2.result}
													</span>
												{:else if Number(check_result) >= Number(item_2.parameter?.mini) && Number(check_result) <= Number(item_2.parameter?.maxi)}
													<span>{check_result}</span>
												{:else if Number(check_result) < Number(item_2.parameter?.mini)}
													<span style="color: #0000FF;">{check_result} L</span>
												{:else if Number(check_result) > Number(item_2.parameter?.maxi)}
													<span style="color: #FF0000;">{check_result} H</span>
												{:else}
													<span style="color: #0000FF;">
														{item_2.result}
													</span>
												{/if}
											</td>
											<td style="font-size: 120%;" class="p-0 m-0 en_font_times_new_roman">
												<Athtml html={item_2.parameter?.unit?.unit ?? ''} />
												<!-- {@html browser ? item_2.parameter?.unit?.unit ?? '' : ''} -->
											</td>
											<td style="font-size: 120%;" class="p-0 m-0 en_font_times_new_roman">
												<span class="p-0 m-0">
													{item_2.parameter?.mini === 0
														? ''
														: item_2.parameter?.mini?.toLocaleString('en-US')}</span
												>
												<span class="p-0 m-0"> {item_2.parameter?.sign}</span>
												<span class="p-0 m-0">
													{item_2.parameter?.maxi === 0
														? ''
														: item_2.parameter?.maxi?.toLocaleString('en-US')}</span
												>
											</td>
										</tr>
									{/each}
								{/if}
							{/each}
						</tbody>
					</table>
				{/each}
				<div class="row">
					{#each get_imagers || [] as item}
						<div class="col-6 p-2">
							<img
								class="img-fluid"
								style="width: 100%;height: 100%;"
								src="/files/{item.filename}"
								alt="some alt text"
							/>
						</div>
					{/each}
				</div>
				{#if get_visit?.laboratory?.doctor_comment?.length}
					<div class=" border p-2 m-0">
						<h5>Comment</h5>
						<span class="ms-4"><Athtml html={get_visit?.laboratory?.doctor_comment ?? ''} /> </span>
					</div>
				{/if}
			</tbody>
			<tfoot>
				<div class="footer-space">&nbsp;</div>
			</tfoot>
		</table>
		<div class="footer">
			<div style="font-size: 110%;" class="en_font_times_new_roman row">
				<div class="col-4 text-center">
					<span class="kh_font_battambang"> ថ្ងៃទី </span>
					<span>{get_visit?.laboratory?.finish_datetime?.slice(8, 10) ?? ''}</span>
					<span class="kh_font_battambang"> ខែ </span>
					<span>{get_visit?.laboratory?.finish_datetime?.slice(5, 7) ?? ''}</span>
					<span class="kh_font_battambang"> ឆ្នាំ </span>
					<span>{get_visit?.laboratory?.finish_datetime?.slice(0, 4) ?? ''}</span>
					<p>Sign's Physician</p>
					<br />
					<p>My Name is</p>
				</div>

				<div class="col-4 text-center">
					<img style="height: 80%;" src={url_qr} alt="" />
				</div>
				<div class="col-4 text-center">
					<span style="font-size: 100%;" class="kh_font_battambang"> ថ្ងៃទី </span>
					<span>{get_visit?.laboratory?.finish_datetime?.slice(8, 10) ?? ''}</span>
					<span class="kh_font_battambang"> ខែ </span>
					<span>{get_visit?.laboratory?.finish_datetime?.slice(5, 7) ?? ''}</span>
					<span class="kh_font_battambang"> ឆ្នាំ </span>
					<span>{get_visit?.laboratory?.finish_datetime?.slice(0, 4) ?? ''}</span>
					<p>Sign's Technician</p>
					<br />
					<p>My Name is</p>
				</div>
			</div>
			<hr class="mt-0" />
			<h6 style="color:#0000FF" class="text-center">
				{get_clinic_info?.address ?? ''}
			</h6>
		</div>
	</div>
</div>

<style>
	@media print {
		.footer,
		.footer-space {
			min-height: 250px;
		}
		.header,
		.header-space {
			height: 355px;
		}
		.header {
			width: 99%;
			position: fixed;
			top: 1mm;
		}
		.footer {
			width: 100%;
			position: fixed;
			bottom: 0;

			/* padding-bottom: 10mm; */
			/* margin-top: 20mm; */
			padding-top: 10mm;
			/* margin-bottom: 5mm; */
		}
	}
</style>
