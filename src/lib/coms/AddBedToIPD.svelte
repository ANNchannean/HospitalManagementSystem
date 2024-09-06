<script lang="ts">
	import type { PageServerData } from '../../routes/(dash)/ipd/$types';
	type Data = Pick<PageServerData, 'get_progress_notes' | 'get_wards'>;
	export let data: Data;
	$: ({ get_wards, get_progress_notes } = data);
	export let bed_id = 0;
</script>

<!-- @_List_Parameter -->
<div class="modal fade" id="add_bed_ipd">
	<div class="modal-dialog modal-dialog-scrollabl modal-xl">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title">Ward/Room/Bed</h4>
				<button
					id="close_add_bed_ipd"
					type="button"
					class="btn-close"
					data-bs-dismiss="modal"
					aria-label="Close"
				>
				</button>
			</div>
			<div class="modal-body">
				<div class="">
					{#each get_wards as item}
						{@const rooms = item.room}
						<div style="border:2px solid blue;" class=" position-relative rounded">
							<div
								style="
									left: 10%;
									-ms-transform: translate(-50%, -50%);
									transform: translate(-50%, -50%);"
								class="position-absolute top-0 m-0"
							>
								<button class="btn btn-primary btn-lg">{item.ward ?? ''}</button>
							</div>
							<br />
							{#each rooms as room}
								{@const beds = room.bed}
								<div class="separator"><button class="btn btn-primary">{room.room}</button></div>
								<br />
								<div class="">
									<div class="row justify-content-start">
										{#each beds as bed}
											{@const find_progress_note = get_progress_notes.find(
												(e) => e.bed_id === bed.id
											)}
											<div class="card text-bg-light mb-3 ms-4" style="max-width: 500px;">
												<div class="row g-0">
													<div
														class:text-danger={find_progress_note || bed.id === bed_id}
														class="col-md-4 text-primary"
													>
														<i class="fa-solid fa-bed fa-6x ms-2"></i>
													</div>
													<div class="col-md-8">
														<div class="card-body">
															<button
																type="button"
																on:click={() => {
																	if (bed_id === bed.id) {
																		bed_id = 0;
																	} else {
																		bed_id = 0;

																		bed_id = bed.id;
																	}
																}}
																class:btn-danger={find_progress_note || bed.id === bed_id}
																class="card-title btn btn-primary m-0 btn-sm"
															>
																{bed.bed}
															</button>
															{#if find_progress_note}
																<a
																	on:click={() =>
																		document.getElementById('close_view_room')?.click()}
																	href="/ipd?patient_id={find_progress_note?.patient_id}&progress_note_id={find_progress_note?.id}"
																	class:btn-danger={find_progress_note}
																	class="card-title btn btn-primary m-0 btn-sm"
																>
																	Chagne Bed
																</a>
															{/if}
															<table class="">
																<thead>
																	{#if find_progress_note}
																		<tr>
																			<td>Name khmer </td>
																			<td> : </td>
																			<td>
																				<p class="card-text">
																					{find_progress_note?.patient.name_khmer ?? ''}
																				</p>
																			</td>
																		</tr>
																		<tr>
																			<td>Name latin</td>
																			<td> : </td>
																			<td>
																				<p class="card-text">
																					{find_progress_note?.patient.name_latin ?? ''}
																				</p>
																			</td>
																		</tr>
																		<tr>
																			<td>Etiology</td>
																			<td> : </td>
																			<td>
																				<p class="card-text">
																					{find_progress_note?.etiology ?? ''}
																				</p>
																			</td>
																		</tr>
																		<tr>
																			<td>Date</td>
																			<td> : </td>
																			<td>
																				<p class="card-text">
																					{new Intl.DateTimeFormat('en-GB', {
																						dateStyle: 'short',
																						timeStyle: 'short',
																						hour12: true
																					}).format(
																						new Date(String(find_progress_note?.date_checkup))
																					)}
																				</p>
																			</td>
																		</tr>
																	{:else}
																		<tr>
																			<td>Name khmer </td>
																			<td> : </td>
																			<td> </td>
																		</tr>
																		<tr>
																			<td>Name latin</td>
																			<td> : </td>
																			<td> </td>
																		</tr>
																		<tr>
																			<td>Etiology</td>
																			<td> : </td>
																			<td> </td>
																		</tr>
																		<tr>
																			<td>Date</td>
																			<td> : </td>
																			<td> </td>
																		</tr>
																	{/if}
																</thead>
															</table>
														</div>
													</div>
												</div>
											</div>
										{/each}
									</div>
								</div>
							{/each}
						</div>
						<br />
						<br />
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
