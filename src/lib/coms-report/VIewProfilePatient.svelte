<script lang="ts">
	import type { PageServerData } from '../../routes/(dash)/patient/all/$types';
	type Data = Pick<PageServerData, 'get_patients'>;
	export let data: Data;
	export let patient_id: number;
	$: ({ get_patients } = data);
	$: find_patient = get_patients[0];
</script>

<div class="modal fade modal-xl" id="view-patient" data-bs-backdrop="static">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title">About Patient</h4>
				<button
					on:click={() => {
						patient_id = 0;
					}}
					type="button"
					class="btn-close"
					data-bs-dismiss="modal"
					aria-label="Close"
				>
				</button>
			</div>
			<div class="modal-body">
				<div class="row">
					<div class="col-md-6">
						<div class="about-avatar">
							{#if find_patient?.fileOrPicture?.filename}
								<img
									class="img-fluid img-thumbnail"
									style="width: 100%; height: 100%;"
									src="/files/{find_patient?.fileOrPicture?.filename}"
									title=""
									alt=""
								/>
							{:else}
								<img
									class="img-fluid img-thumbnail"
									style="width: 100%; height: 100%;"
									src="/no-image.jpg"
									title=""
									alt=""
								/>
							{/if}
						</div>
					</div>
					<div class="col-md-6 img-thumbnail">
						<table class="table text-wrap table-bordered text-start alert alert-success">
							<thead>
								<tr>
									<td>Name Khmer</td>
									<td>:</td>
									<td>{find_patient?.name_khmer}</td>
								</tr>

								<tr>
									<td>Name Latin</td>
									<td>:</td>
									<td>{find_patient?.name_latin}</td>
								</tr>
								<tr>
									<td>DOB</td>
									<td>:</td>
									<td
										>{new Intl.DateTimeFormat('en-GB', { dateStyle: 'short' })
											.format(new Date(find_patient?.dob ?? new Date()))
											.split('/')
											.join('-')}</td
									>
								</tr>
								<tr>
									<td>Age</td>
									<td>:</td>
									<td>{find_patient?.age} years</td>
								</tr>
								<tr>
									<td>Address</td>
									<td>:</td>
									<td
										>{find_patient?.village?.type ?? ''}
										{find_patient?.village?.name_khmer.concat(',') ?? ''}
										{find_patient?.commune?.type ?? ''}
										{find_patient?.commune?.name_khmer.concat(',') ?? ''}
										{find_patient?.district?.type ?? ''}
										{find_patient?.district?.name_khmer.concat(',') ?? ''}
										{find_patient?.provice?.type ?? ''}
										{find_patient?.provice?.name_khmer ?? ''}</td
									>
								</tr>
							</thead>
						</table>
						<button class="btn btn-lg btn-primary w-100 mb-2">OPD 1</button>
						<button class="btn btn-lg btn-danger w-100">IPD 2</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
