<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageServerData } from './$types';
	import { dobToAge } from '$lib/helper';
	import Renderhtml from '$lib/coms/Renderhtml.svelte';
	import ClinichInfo from '$lib/coms/ClinichInfo.svelte';
	import { page } from '$app/stores';
	import DateTimeFormat from '$lib/coms/DateTimeFormat.svelte';
	export let data: PageServerData;
	$: ({ get_imagerie_request, url_qr, get_clinic_info } = data);
	$: age_p_visit = dobToAge({
		dob: get_imagerie_request?.visit?.patient.dob ?? '',
		date: get_imagerie_request?.visit?.date_checkup ?? ''
	});
	let isPrint = $page.url.searchParams.get('print');
	let row = $page.url.searchParams.get('row');
	onMount(async () => {
		document.getElementsByTagName('body')[0].onbeforeprint = function () {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		};
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
							<td class="p-0 m-0">{get_imagerie_request?.visit?.patient?.name_khmer}</td>
							<td style="font-size: 110%;" class="text-bold en_font_times_new_roman p-0 m-0"
								>Gender</td
							>
							<td class="p-0 m-0"> : </td>
							<td class="p-0 m-0">{get_imagerie_request?.visit?.patient?.gender ?? ''}</td>
							<td style="font-size: 110%;" class="text-bold en_font_times_new_roman p-0 m-0"
								>Imagrie</td
							>
							<td class="p-0 m-0"> : </td>
							<td class="p-0 m-0">{get_imagerie_request?.id}</td>
						</tr>
						<tr class="p-0 m-0">
							<td style="font-size: 110%;" class="text-bold en_font_times_new_roman p-0 m-0"
								>Latin Name</td
							>
							<td class="p-0 m-0"> : </td>
							<td class="p-0 m-0">{get_imagerie_request?.visit?.patient?.name_latin}</td>
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
								<DateTimeFormat date={get_imagerie_request?.visit?.date_checkup} />
							</td>
						</tr>
						<tr class="p-0 m-0">
							<td style="font-size: 110%;" class="text-bold en_font_times_new_roman p-0 m-0"
								>Requester</td
							>
							<td class="p-0 m-0"> : </td>
							<td class="p-0 m-0">{get_imagerie_request?.visit?.staff?.name ?? ''}</td>
							<td style="font-size: 110%;" class="text-bold en_font_times_new_roman p-0 m-0"
								>Etiology</td
							>
							<td class="p-0 m-0"> : </td>
							<td class="p-0 m-0">{get_imagerie_request?.visit?.etiology ?? ''}</td>
							<td style="font-size: 110%;" class="text-bold en_font_times_new_roman p-0 m-0"
								>Report Date</td
							>
							<td class="p-0 m-0"> : </td>
							<td class="p-0 m-0">
								<DateTimeFormat date={get_imagerie_request?.finish_datetime} />
							</td>
						</tr>
						<tr class="p-0 m-0">
							<td style="font-size: 110%;" class="text-bold en_font_times_new_roman p-0 m-0"
								>Phone</td
							>
							<td class="p-0 m-0"> : </td>
							<td style="font-size: 110%;" class="en_font_times_new_roman p-0 m-0"
								>{get_imagerie_request?.visit?.patient?.telephone ?? ''}</td
							>
							<td style="font-size: 110%;" class="text-bold en_font_times_new_roman p-0 m-0"
								>Visit</td
							>
							<td class="p-0 m-0"> : </td>
							<td style="font-size: 110%;" class="en_font_times_new_roman p-0 m-0"
								>{get_imagerie_request?.visit?.checkin_type ?? ''}</td
							>
							<td style="font-size: 110%;" class="text-bold en_font_times_new_roman p-0 m-0"
								>Request</td
							>
							<td class="p-0 m-0"> : </td>
							<td style="font-size: 110%;" class="en_font_times_new_roman p-0 m-0"
								>{get_imagerie_request?.product?.products ?? ''}</td
							>
						</tr>
						<tr class="p-0 m-0">
							<td style="font-size: 110%;" class="text-bold en_font_times_new_roman p-0 m-0"
								>Address</td
							>
							<td class="p-0 m-0"> : </td>
							<td colspan="7" class="kh_font_battambang p-0 m-0">
								{get_imagerie_request?.visit?.patient?.village?.type ?? ''}
								{get_imagerie_request?.visit?.patient?.village?.name_khmer.concat(',') ?? ''}
								{get_imagerie_request?.visit?.patient?.commune?.type ?? ''}
								{get_imagerie_request?.visit?.patient?.commune?.name_khmer.concat(',') ?? ''}
								{get_imagerie_request?.visit?.patient?.district?.type ?? ''}
								{get_imagerie_request?.visit?.patient?.district?.name_khmer.concat(',') ?? ''}
								{get_imagerie_request?.visit?.patient?.provice?.type ?? ''}
								{get_imagerie_request?.visit?.patient?.provice?.name_khmer ?? ''}
							</td>
						</tr>
					</thead>
				</table>
			</div>
		</div>
		<table class="">
			<thead>
				<div class="header-space">&nbsp;</div>
			</thead>
			<tbody>
				<u>
					<h1 style="font-size: 130%;" class="text-center kh_font_muol">
						លទ្ធផលរូបភាពវេជ្ជសាស្ត្រ
					</h1>
					<h1 style="font-size: 100%;" class="text-center en_font_times_new_roman">
						Imagerie Result
					</h1>
				</u>
				{#if row === 'true'}
					<div style="width: 100%;">
						<Renderhtml setWidth="100%" value={get_imagerie_request?.result ?? ''} />
					</div>
					<div class="row">
						{#each get_imagerie_request?.fileOrPicture || [] as item}
							<div class="col-4 p-2">
								<img
									style="width: 100%;height: 100%;"
									src="/files/{item.filename}"
									alt="some alt text"
								/>
							</div>
						{/each}
					</div>
				{:else}
					<div class="row g-0">
						<div class="col-4">
							{#each get_imagerie_request?.fileOrPicture || [] as item}
								<div class="p-2">
									<img
										style="width: 100%;height: 100%;"
										src="/files/{item.filename}"
										alt="some alt text"
									/>
								</div>
							{/each}
						</div>
						<div style="zoom: 90%;" class="col-8">
							<Renderhtml setWidth="100%" value={get_imagerie_request?.result ?? ''} />
						</div>
					</div>
				{/if}
			</tbody>
			<tfoot>
				<div class="footer-space">&nbsp;</div>
			</tfoot>
		</table>
		<div class="footer">
			<div style="font-size: 110%;" class="en_font_times_new_roman row">
				<div class="col-4">
					<img style="height: 80%;" src={url_qr} alt="" />
				</div>
				<div class="col-4 text-center">
					<span style="font-size: 100%;" class="kh_font_battambang"> ថ្ងៃទី </span>

					<span class="kh_font_battambang"> ខែ </span>

					<span class="kh_font_battambang"> ឆ្នាំ </span>

					<p>Sign's Physician</p>
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
			height: 200px;
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
			bottom: 1mm;
			padding-top: 15px;
			margin-top: 10px;
		}
	}
</style>
