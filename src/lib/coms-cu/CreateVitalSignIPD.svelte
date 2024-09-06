<script lang="ts">
	import type { PageServerData } from '../../routes/(dash)/ipd/[progress_note_id]/vital-sign/$types';
	import { enhance } from '$app/forms';
	import SubmitButton from '$lib/coms/SubmitButton.svelte';
	type Data = Pick<PageServerData, 'get_vital_sing_ipd'>;
	export let data: Data;
	export let vital_sign_id: number;
	$: ({ get_vital_sing_ipd } = data);
	$: find_vital_sign_ipd = get_vital_sing_ipd[0];
	let loading = false;
</script>

<!-- @_Add_ParameterGrop -->
<div class="modal fade" id="create_vital_sign_ipd" data-bs-backdrop="static">
	<div class="modal-dialog modal-xl">
		<form
			action="?/create_vital_sign_ipd"
			method="post"
			class="modal-content"
			use:enhance={() => {
				loading = true;
				return async ({ update, result }) => {
					await update({ reset: false });
					loading = false;
					if (result.type !== 'failure') {
						document.getElementById('close_vital_sign')?.click();
					}
				};
			}}
		>
			<input type="hidden" value={vital_sign_id || ''} name="vital_sign_id" />
			<div class="modal-header">
				<h4 class="modal-title">VitalSign</h4>

				<button
					on:click={() => (vital_sign_id = 0)}
					id="close_vital_sign"
					type="button"
					class="btn-close"
					data-bs-dismiss="modal"
					aria-label="Close"
				>
				</button>
			</div>
			<div class="modal-body">
				<div class="card-body pt-0">
					{#if vital_sign_id}
						<input value={find_vital_sign_ipd?.datetime || ''} type="hidden" name="date" />

						<div class="form-group row pb-3">
							<label for="time" class="col-sm-3 col-form-label">Time</label>
							<div class="col-sm-9">
								<div class="input-group">
									<input
										value={new Intl.DateTimeFormat('en-GB', { timeStyle: 'short' }).format(
											new Date(find_vital_sign_ipd?.datetime ?? '')
										)}
										id="time"
										name="time"
										type="time"
										class="form-control"
									/>
								</div>
							</div>
						</div>
					{/if}
					<div class="form-group row pb-3">
						<label for="bp" class="col-sm-3 col-form-label">BP (mmHg)</label>
						<div class="col-sm-9">
							<div class="row">
								<div class="col-sm-6">
									<div class="input-group">
										<input
											value={find_vital_sign_ipd?.sbp?.toFixed(0) ?? ''}
											id="sbp"
											placeholder="Systolic"
											name="sbp"
											type="number"
											step="any"
											class="form-control"
										/>
									</div>
								</div>
								<div class="col-sm-6">
									<div class="input-group">
										<input
											value={find_vital_sign_ipd?.dbp?.toFixed(0) ?? ''}
											id="dbp"
											placeholder="Diastolic"
											name="dbp"
											type="number"
											step="any"
											class="form-control"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="form-group row pb-3">
						<label for="pulse" class="col-sm-3 col-form-label">Pulse (min)</label>
						<div class="col-sm-9">
							<div class="input-group">
								<input
									value={find_vital_sign_ipd?.pulse?.toFixed(0) ?? ''}
									id="pulse"
									name="pulse"
									type="number"
									step="any"
									class="form-control"
								/>
							</div>
						</div>
					</div>
					<div class="form-group row pb-3">
						<label for="t" class="col-sm-3 col-form-label">T (C)</label>
						<div class="col-sm-9">
							<div class="input-group">
								<input
									value={find_vital_sign_ipd?.t?.toFixed(1) ?? ''}
									id="t"
									name="t"
									type="number"
									step="any"
									class="form-control"
								/>
							</div>
						</div>
					</div>
					<div class="form-group row pb-3">
						<label for="rr" class="col-sm-3 col-form-label">RR (min)</label>
						<div class="col-sm-9">
							<div class="input-group">
								<input
									value={find_vital_sign_ipd?.rr?.toFixed(0) ?? ''}
									id="rr"
									name="rr"
									type="number"
									step="any"
									class="form-control"
								/>
							</div>
						</div>
					</div>
					<div class="form-group row pb-3">
						<label for="sp02" class="col-sm-3 col-form-label">SpO2 (%)</label>
						<div class="col-sm-9">
							<div class="input-group">
								<input
									value={find_vital_sign_ipd?.sp02?.toFixed(0) ?? ''}
									id="sp02"
									name="sp02"
									type="number"
									step="any"
									class="form-control"
								/>
							</div>
						</div>
					</div>
					<div class="form-group row pb-3">
						<label for="weight" class="col-sm-3 col-form-label">Weight (kg)</label>
						<div class="col-sm-9">
							<div class="input-group">
								<input
									value={find_vital_sign_ipd?.weight?.toFixed(0) ?? ''}
									id="weight"
									name="weight"
									type="number"
									step="any"
									class="form-control"
								/>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-sm-3"></div>
						<div class="col-sm-9">
							<div class="row p-2">
								<div class="col-6 border rounded p-3">
									<div class="form-group row pb-3">
										<label for="piv" class="col-sm-3 col-form-label">Piv</label>
										<div class="col-sm-9">
											<div class="input-group">
												<input
													value={find_vital_sign_ipd?.piv ?? ''}
													id="piv"
													name="piv"
													type="number"
													step="any"
													class="form-control"
												/>
											</div>
										</div>
									</div>
									<div class="form-group row pb-3">
										<label for="drink" class="col-sm-3 col-form-label">Drink</label>
										<div class="col-sm-9">
											<div class="input-group">
												<input
													value={find_vital_sign_ipd?.drink ?? ''}
													id="drink"
													name="drink"
													type="number"
													step="any"
													class="form-control"
												/>
											</div>
										</div>
									</div>
									<div class="form-group row pb-3">
										<label for="nasogastric_tube_in" class="col-sm-3 col-form-label">NG in</label>
										<div class="col-sm-9">
											<div class="input-group">
												<input
													value={find_vital_sign_ipd?.nasogastric_tube_in ?? ''}
													id="nasogastric_tube_in"
													name="nasogastric_tube_in"
													class="form-control"
													type="number"
													step="any"
												/>
											</div>
										</div>
									</div>
								</div>
								<div class="col-6 border rounded p-3">
									<div class="form-group row pb-3">
										<label for="nasogastric_tube_out" class="col-sm-3 col-form-label">NG out</label>
										<div class="col-sm-9">
											<div class="input-group">
												<input
													value={find_vital_sign_ipd?.nasogastric_tube_out ?? ''}
													id="nasogastric_tube_out"
													name="nasogastric_tube_out"
													class="form-control"
													type="number"
													step="any"
												/>
											</div>
										</div>
									</div>
									<div class="form-group row pb-3">
										<label for="fluid_out" class="col-sm-3 col-form-label">Fluid out</label>
										<div class="col-sm-9">
											<div class="input-group">
												<input
													value={find_vital_sign_ipd?.fluid_out ?? ''}
													id="fluid_out"
													name="fluid_out"
													class="form-control"
													type="number"
													step="any"
												/>
											</div>
										</div>
									</div>
									<div class="form-group row pb-3">
										<label for="vomiting" class="col-sm-3 col-form-label">Vomiting</label>
										<div class="col-sm-9">
											<div class="input-group">
												<input
													value={find_vital_sign_ipd?.vomiting ?? ''}
													id="vomiting"
													name="vomiting"
													type="number"
													step="any"
													class="form-control"
												/>
											</div>
										</div>
									</div>
									<div class="form-group row pb-3">
										<label for="stool" class="col-sm-3 col-form-label">Stool</label>
										<div class="col-sm-9">
											<div class="input-group">
												<input
													value={find_vital_sign_ipd?.stool ?? ''}
													id="stool"
													name="stool"
													type="number"
													step="any"
													class="form-control"
												/>
											</div>
										</div>
									</div>
									<div class="form-group row pb-3">
										<label for="urine" class="col-sm-3 col-form-label">Urine</label>
										<div class="col-sm-9">
											<div class="input-group">
												<input
													value={find_vital_sign_ipd?.urine ?? ''}
													id="urine"
													name="urine"
													type="number"
													step="any"
													class="form-control"
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<br />
					<div class="form-group row pb-3">
						<label for="note" class="col-sm-3 col-form-label">Note</label>
						<div class="col-sm-9">
							<div class="input-group">
								<textarea
									value={find_vital_sign_ipd?.note ?? ''}
									id="note"
									name="note"
									class="form-control"
									rows="4"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer justify-content-end">
				<SubmitButton {loading} />
			</div>
		</form>
	</div>
</div>
