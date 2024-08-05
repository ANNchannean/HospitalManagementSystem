<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageServerData } from './$types';
	import { browser } from '$app/environment';
	import { dobToAge } from '$lib/helper';
	import Athtml from '$lib/components/etc/Athtml.svelte';
	export let data: PageServerData;
	$: ({ get_imagerie_request, url_qr, get_clinic_info } = data);
	onMount(async () => {
		// setTimeout(async () => {
		// 	window.print();
		// 	window.close();
		// }, 300);
	});
</script>

<div class="col-12">
	<div class="row justify-content-center">
		<div style="width: 1200px;">
			<table class="super-table">
				<thead class="pageheader">
					<tr>
						<td>
							<div class="col-12">
								<div class="row">
									<div class="col-auto text-center">
										<img
											id="imgp1"
											height="150px"
											class="float-right"
											src="/files/{get_clinic_info?.fileOrPicture[0]?.filename}"
											alt="no logo"
										/>
									</div>
									<div class="col text-center pt-1">
										<p style="font-size: 30px;color:#0000FF" class="kh_font_muol m-0">
											{get_clinic_info?.title_khm ?? ''}
										</p>
										<p style="font-size: 25px;color:#0000FF" class="en_font_times_new_roman m-0">
											{get_clinic_info?.title_eng ?? ''}
										</p>
										<p style="font-size: 20px;color:#0000FF" class="kh_font_battambang m-0">
											{get_clinic_info?.detail ?? ''}
										</p>
										<p style="font-size: 20px;color:#FF00FF" class="kh_font_battambang m-0">
											{get_clinic_info?.contact ?? ''}
										</p>
									</div>
									<div class="col-auto text-center">
										<img
											height="150px"
											class="float-right"
											src="/files/{get_clinic_info?.fileOrPicture[1]?.filename}"
											alt="no logo"
										/>
									</div>
								</div>
							</div>
							<div class="col-12 pt-1 pb-3">
								<dir class="row border p-2 m-0">
									<table class="mb-0 p-0 m-0 table table-sm table-borderless">
										<thead class="">
											<tr class="p-0 m-0">
												<td
													style="font-size: 110%;"
													class="text-bold en_font_times_new_roman p-0 m-0">Khmer Name</td
												>
												<td class="p-0 m-0"> : </td>
												<td class="p-0 m-0">{get_imagerie_request?.visit?.patient?.name_khmer}</td>
												<td
													style="font-size: 110%;"
													class="text-bold en_font_times_new_roman p-0 m-0">Gender</td
												>
												<td class="p-0 m-0"> : </td>
												<td class="p-0 m-0">{get_imagerie_request?.visit?.patient?.gender ?? ''}</td
												>
												<td
													style="font-size: 110%;"
													class="text-bold en_font_times_new_roman p-0 m-0">Imagrie</td
												>
												<td class="p-0 m-0"> : </td>
												<td class="p-0 m-0">{get_imagerie_request?.id}</td>
											</tr>
											<tr class="p-0 m-0">
												<td
													style="font-size: 110%;"
													class="text-bold en_font_times_new_roman p-0 m-0">Latin Name</td
												>
												<td class="p-0 m-0"> : </td>
												<td class="p-0 m-0">{get_imagerie_request?.visit?.patient?.name_latin}</td>
												<td
													style="font-size: 110%;"
													class="text-bold en_font_times_new_roman p-0 m-0">Age</td
												>
												<td class="p-0 m-0"> : </td>
												<td class="p-0 m-0">
													អាយុ {dobToAge({
														d: new Date(get_imagerie_request?.visit?.patient?.dob ?? '').getDate(),
														m:
															new Date(get_imagerie_request?.visit?.patient?.dob ?? '').getMonth() +
															1,
														y: new Date(
															get_imagerie_request?.visit?.patient?.dob ?? ''
														).getFullYear(),
														date: new Date(get_imagerie_request?.visit?.date_checkup ?? '')
													}).y} ឆ្នាំ ,
													{dobToAge({
														d: new Date(get_imagerie_request?.visit?.patient?.dob ?? '').getDate(),
														m:
															new Date(get_imagerie_request?.visit?.patient?.dob ?? '').getMonth() +
															1,
														y: new Date(
															get_imagerie_request?.visit?.patient?.dob ?? ''
														).getFullYear(),
														date: new Date(get_imagerie_request?.visit?.date_checkup ?? '')
													}).m} ខែ ,
													{dobToAge({
														d: new Date(get_imagerie_request?.visit?.patient?.dob ?? '').getDate(),
														m:
															new Date(get_imagerie_request?.visit?.patient?.dob ?? '').getMonth() +
															1,
														y: new Date(
															get_imagerie_request?.visit?.patient?.dob ?? ''
														).getFullYear(),
														date: new Date(get_imagerie_request?.visit?.date_checkup ?? '')
													}).d} ថ្ងៃ
												</td>
												<td
													style="font-size: 110%;"
													class="text-bold en_font_times_new_roman p-0 m-0">Collection Date</td
												>
												<td class="p-0 m-0"> : </td>
												<td class="p-0 m-0"
													>{new Intl.DateTimeFormat('en-GB', {
														dateStyle: 'short',
														hour12: true,
														timeStyle: 'short'
													}).format(new Date(get_imagerie_request?.visit?.date_checkup ?? ''))}</td
												>
											</tr>
											<tr class="p-0 m-0">
												<td
													style="font-size: 110%;"
													class="text-bold en_font_times_new_roman p-0 m-0">Requester</td
												>
												<td class="p-0 m-0"> : </td>
												<td class="p-0 m-0">{get_imagerie_request?.visit?.staff?.name ?? ''}</td>
												<td
													style="font-size: 110%;"
													class="text-bold en_font_times_new_roman p-0 m-0">Etiology</td
												>
												<td class="p-0 m-0"> : </td>
												<td class="p-0 m-0">{get_imagerie_request?.visit?.etiology ?? ''}</td>
												<td
													style="font-size: 110%;"
													class="text-bold en_font_times_new_roman p-0 m-0">Report Date</td
												>
												<td class="p-0 m-0"> : </td>
												<td class="p-0 m-0"
													>{new Intl.DateTimeFormat('en-GB', {
														dateStyle: 'short',
														hour12: true,
														timeStyle: 'short'
													}).format(
														new Date(get_imagerie_request?.finish_datetime || new Date())
													)}</td
												>
											</tr>
											<tr class="p-0 m-0">
												<td
													style="font-size: 110%;"
													class="text-bold en_font_times_new_roman p-0 m-0">Phone</td
												>
												<td class="p-0 m-0"> : </td>
												<td style="font-size: 110%;" class="en_font_times_new_roman p-0 m-0"
													>{get_imagerie_request?.visit?.patient?.telephone ?? ''}</td
												>
												<td
													style="font-size: 110%;"
													class="text-bold en_font_times_new_roman p-0 m-0">Visit</td
												>
												<td class="p-0 m-0"> : </td>
												<td style="font-size: 110%;" class="en_font_times_new_roman p-0 m-0"
													>{get_imagerie_request?.visit?.checkin_type ?? ''}</td
												>
												<td
													style="font-size: 110%;"
													class="text-bold en_font_times_new_roman p-0 m-0">Request</td
												>
												<td class="p-0 m-0"> : </td>
												<td style="font-size: 110%;" class="en_font_times_new_roman p-0 m-0"
													>{get_imagerie_request?.product?.products ?? ''}</td
												>
											</tr>
											<tr class="p-0 m-0">
												<td
													style="font-size: 110%;"
													class="text-bold en_font_times_new_roman p-0 m-0">Address</td
												>
												<td class="p-0 m-0"> : </td>
												<td colspan="7" class="kh_font_battambang p-0 m-0">
													{get_imagerie_request?.visit?.patient?.village?.type ?? ''}
													{get_imagerie_request?.visit?.patient?.village?.name_khmer.concat(',') ??
														''}
													{get_imagerie_request?.visit?.patient?.commune?.type ?? ''}
													{get_imagerie_request?.visit?.patient?.commune?.name_khmer.concat(',') ??
														''}
													{get_imagerie_request?.visit?.patient?.district?.type ?? ''}
													{get_imagerie_request?.visit?.patient?.district?.name_khmer.concat(',') ??
														''}
													{get_imagerie_request?.visit?.patient?.provice?.type ?? ''}
													{get_imagerie_request?.visit?.patient?.provice?.name_khmer ?? ''}
												</td>
											</tr>
										</thead>
									</table>
								</dir>
							</div>
						</td>
					</tr>
				</thead>
				<tfoot class="">
					<tr>
						<td>
							<div class="col-12">
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
						</td>
					</tr>
				</tfoot>
				<tbody>
					<tr>
						<td>
							<u>
								<h1 style="font-size: 130%;" class="text-center kh_font_muol">
									លទ្ធផលរូបភាពវេជ្ជសាស្ត្រ
								</h1>
								<h1 style="font-size: 100%;" class="text-center en_font_times_new_roman">
									Imagerie Result
								</h1>
							</u>
							<hr />
							<div class="row">
								<Athtml html={get_imagerie_request?.result ?? ''} />
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
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>

<style>
	@page {
		size: A4;
		margin-bottom: 1mm;
		margin-left: 5mm;
		margin-top: 5mm;
		margin-right: 5mm;
	}
</style>
