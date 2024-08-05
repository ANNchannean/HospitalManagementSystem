<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageServerData } from './$types';
	import { dobToAge } from '$lib/helper';
	import Athtml from '$lib/components/etc/Athtml.svelte';
	export let data: PageServerData;
	$: ({ get_visit, removeDuplicateName, sort_laboraytor, get_clinic_info, get_imagers, url_qr } =
		data);
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
				<thead class="">
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
												<td class="p-0 m-0">{get_visit?.patient?.name_khmer}</td>
												<td
													style="font-size: 110%;"
													class="text-bold en_font_times_new_roman p-0 m-0">Gender</td
												>
												<td class="p-0 m-0"> : </td>
												<td class="p-0 m-0">{get_visit?.patient?.gender ?? ''}</td>
												<td
													style="font-size: 110%;"
													class="text-bold en_font_times_new_roman p-0 m-0">Lab</td
												>
												<td class="p-0 m-0"> : </td>
												<td class="p-0 m-0">{get_visit?.id ?? ''}</td>
											</tr>
											<tr class="p-0 m-0">
												<td
													style="font-size: 110%;"
													class="text-bold en_font_times_new_roman p-0 m-0">Latin Name</td
												>
												<td class="p-0 m-0"> : </td>
												<td class="p-0 m-0">{get_visit?.patient?.name_latin}</td>
												<td
													style="font-size: 110%;"
													class="text-bold en_font_times_new_roman p-0 m-0">Age</td
												>
												<td class="p-0 m-0"> : </td>
												<td class="p-0 m-0">
													អាយុ {dobToAge({
														d: new Date(get_visit?.patient?.dob ?? '').getDate(),
														m: new Date(get_visit?.patient?.dob ?? '').getMonth() + 1,
														y: new Date(get_visit?.patient?.dob ?? '').getFullYear(),
														date: new Date(get_visit?.date_checkup ?? '')
													}).y} ឆ្នាំ ,
													{dobToAge({
														d: new Date(get_visit?.patient?.dob ?? '').getDate(),
														m: new Date(get_visit?.patient?.dob ?? '').getMonth() + 1,
														y: new Date(get_visit?.patient?.dob ?? '').getFullYear(),
														date: new Date(get_visit?.date_checkup ?? '')
													}).m} ខែ ,
													{dobToAge({
														d: new Date(get_visit?.patient?.dob ?? '').getDate(),
														m: new Date(get_visit?.patient?.dob ?? '').getMonth() + 1,
														y: new Date(get_visit?.patient?.dob ?? '').getFullYear(),
														date: new Date(get_visit?.date_checkup ?? '')
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
													}).format(new Date(get_visit?.date_checkup ?? ''))}</td
												>
											</tr>
											<tr class="p-0 m-0">
												<td
													style="font-size: 110%;"
													class="text-bold en_font_times_new_roman p-0 m-0">Requester</td
												>
												<td class="p-0 m-0"> : </td>
												<td class="p-0 m-0">{get_visit?.staff?.name ?? ''}</td>
												<td
													style="font-size: 110%;"
													class="text-bold en_font_times_new_roman p-0 m-0">Etiology</td
												>
												<td class="p-0 m-0"> : </td>
												<td class="p-0 m-0">{get_visit?.etiology ?? ''}</td>
												<td
													style="font-size: 110%;"
													class="text-bold en_font_times_new_roman p-0 m-0">Report Date</td
												>
												<td class="p-0 m-0"> : </td>
												<td class="p-0 m-0"
													>{get_visit?.laboratory?.finish_datetime
														? new Intl.DateTimeFormat('en-GB', {
																dateStyle: 'short',
																timeStyle: 'short',
																hour12: true
															}).format(new Date(get_visit?.laboratory?.finish_datetime ?? ''))
														: ''}</td
												>
											</tr>
											<tr class="p-0 m-0">
												<td
													style="font-size: 110%;"
													class="text-bold en_font_times_new_roman p-0 m-0">Phone</td
												>
												<td class="p-0 m-0"> : </td>
												<td style="font-size: 110%;" class="en_font_times_new_roman p-0 m-0"
													>{get_visit?.patient?.telephone ?? ''}</td
												>
												<td
													style="font-size: 110%;"
													class="text-bold en_font_times_new_roman p-0 m-0">Visit</td
												>
												<td class="p-0 m-0"> : </td>
												<td style="font-size: 110%;" class="en_font_times_new_roman p-0 m-0"
													>{get_visit?.checkin_type ?? ''}</td
												>
												<td
													style="font-size: 110%;"
													class="text-bold en_font_times_new_roman p-0 m-0">Sample</td
												>
												<td class="p-0 m-0"> : </td>
												<td style="font-size: 110%;" class="en_font_times_new_roman p-0 m-0"
													>{get_visit?.laboratory?.sample ?? ''}</td
												>
											</tr>
											<tr class="p-0 m-0">
												<td
													style="font-size: 110%;"
													class="text-bold en_font_times_new_roman p-0 m-0">Address</td
												>
												<td class="p-0 m-0"> : </td>
												<td colspan="7" class="kh_font_battambang p-0 m-0">
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
									<div class="col-4 text-center">
										<span class="kh_font_battambang"> ថ្ងៃទី </span>
										<span>{get_visit?.laboratory?.finish_datetime ?? ''}</span>
										<span class="kh_font_battambang"> ខែ </span>
										<span>{get_visit?.laboratory?.finish_datetime ?? ''}</span>
										<span class="kh_font_battambang"> ឆ្នាំ </span>
										<span>{get_visit?.laboratory?.finish_datetime ?? ''}</span>
										<p>Sign's Physician</p>
										<br />
										<p>My Name is</p>
									</div>

									<div class="col-4 text-center">
										<img style="height: 80%;" src={url_qr} alt="" />
									</div>
									<div class="col-4 text-center">
										<span style="font-size: 100%;" class="kh_font_battambang"> ថ្ងៃទី </span>
										<span>{get_visit?.laboratory?.finish_datetime ?? ''}</span>
										<span class="kh_font_battambang"> ខែ </span>
										<span>{get_visit?.laboratory?.finish_datetime ?? ''}</span>
										<span class="kh_font_battambang"> ឆ្នាំ </span>
										<span>{get_visit?.laboratory?.finish_datetime ?? ''}</span>
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
						</td>
					</tr>
				</tfoot>
				<tbody>
					<tr>
						<td>
							<u>
								<h1 style="font-size: 130%;" class="text-center kh_font_muol">
									លទ្ធផលមន្ទីរពិសោធន៍
								</h1>
								<h1 style="font-size: 100%;" class="text-center en_font_times_new_roman">
									Laboratory Result
								</h1>
							</u>
							<div>
								{#each removeDuplicateName || [] as item_0 (item_0.id)}
									<div class=" p-0 m-0">
										<table class="table text-wrap table-sm table-bordered p-0 m-0">
											<thead class="">
												<th class="text-center" colspan="6">
													<span
														class="en_font_times_new_roman"
														style="font-size: 120%;color:#0000FF"
													>
														{item_0.product?.laboratoryGroup?.laboratory_group ?? ''}</span
													></th
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
																<td
																	style="font-size: 120%;"
																	class="p-0 m-0 en_font_times_new_roman"
																>
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
																<td
																	style="font-size: 120%;"
																	class="p-0 m-0 en_font_times_new_roman"
																>
																	<Athtml html={item_2.parameter?.unit?.unit ?? ''} />
																	<!-- {@html browser ? item_2.parameter?.unit?.unit ?? '' : ''} -->
																</td>
																<td
																	style="font-size: 120%;"
																	class="p-0 m-0 en_font_times_new_roman"
																>
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
									</div>
								{/each}
								<div class="row">
									{#each get_imagers || [] as item}
										<div class="col-6 p-2">
											<img
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
										<span class="ms-4"
											><Athtml html={get_visit?.laboratory?.doctor_comment ?? ''} />
										</span>
									</div>
								{/if}
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