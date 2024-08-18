<script lang="ts">
	import { t } from '$lib/translations';
	import type { LayoutServerData } from '../../../routes/(dash)/$types';
	export let data: LayoutServerData;
	$: ({ get_wards, get_progress_note } = data);
</script>

<!-- @_List_Parameter -->
<div class="modal fade" id="view_room">
	<div class="modal-dialog modal-dialog-scrollabl modal-xl">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title">Room</h4>
				<button
					data-bs-toggle="modal"
					data-bs-target="#create_document"
					id="nest_create_document"
					type="button"
					class="d-none"
				>
				</button>
				<button
					id="close_view_room"
					type="button"
					class="btn-close"
					data-bs-dismiss="modal"
					aria-label="Close"
				>
				</button>
			</div>
			<div class="modal-body">
				<div class="row">
					<div class="col-12">
						<div class="card">
							<div class="card-body table-responsive p-0">
								<table class="table table-sm table-bordered">
									<tbody>
										{#each get_wards as { room, ward, id }, index}
											<tr class="border border-3">
												<td
													style="width: 25%;"
													class="position-relative text-bg-primary text-center justify-content-center"
												>
													<div>
														<button type="button" class="btn btn-primary btn-sm fs-3"
															><i class="fa-solid fa-hospital"></i> {ward}
														</button>
													</div>
												</td>
												<td style="width: 75%;" class="text-start p-0 m-0">
													{#each room as iitem}
														{@const find_progress_note = get_progress_note.find(
															(e) => e.room_id === iitem.id
														)}
														<table class="table table-sm my-2">
															<thead>
																<tr>
																	<td
																		class:text-bg-success={!get_progress_note.some(
																			(e) => e.room_id === iitem.id
																		)}
																		class:text-bg-danger={get_progress_note.some(
																			(e) => e.room_id === iitem.id
																		)}
																		style="width: 40%;"
																		class="justify-content-center align-content-center text-start fs-5 m-0"
																	>
																		&nbsp;<i class="fa-regular fa-window-maximize"></i>&nbsp;
																		{iitem.room}
																		{iitem.product ? `( ${iitem?.product?.products} )` : ''}
																	</td>

																	<td style="width: 60%;">
																		{#if find_progress_note}
																			<div class="table-responsive">
																				<table class="table table-sm">
																					<thead>
																						<tr>
																							<td>{$t('common.patient')}</td>
																							<td>:</td>
																							<td>
																								<a
																									on:click={() =>
																										document
																											.getElementById('close_view_room')
																											?.click()}
																									href="/ipd/{find_progress_note.id}/progress-note"
																								>
																									<span
																										>{find_progress_note?.patient.name_khmer}</span
																									>,
																									<span
																										>{find_progress_note?.patient.name_latin}</span
																									>
																								</a>
																							</td>
																						</tr>
																						<tr>
																							<td>{$t('common.date')}</td>
																							<td>:</td>
																							<td>
																								<span
																									>{new Intl.DateTimeFormat('en-GB', {
																										dateStyle: 'short',
																										timeStyle: 'short',
																										hour12: true
																									}).format(
																										Date.parse(find_progress_note.date_checkup)
																									)}</span
																								>
																							</td>
																						</tr>
																						<tr>
																							<td>{$t('common.etiology')}</td>
																							<td>:</td>
																							<td>
																								<span>{find_progress_note?.etiology}</span>
																							</td>
																						</tr>
																						<tr>
																							<td></td>
																							<td>:</td>
																							<td>
																								<a
																									on:click={() =>
																										document
																											.getElementById('close_view_room')
																											?.click()}
																									href="/ipd?patient_id={find_progress_note.patient_id}&progress_note_id={find_progress_note.id}"
																								>
																									<span>Chagne Room</span>
																								</a>
																							</td>
																						</tr>
																					</thead>
																				</table>
																			</div>
																		{/if}
																	</td>
																</tr>
															</thead>
														</table>
													{/each}
												</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
