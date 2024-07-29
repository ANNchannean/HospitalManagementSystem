<script lang="ts">
	import type { PageServerData } from './$types';
	export let data: PageServerData;
	$: ({ get_pregress_notes } = data);
	import { inerHight } from '$lib/store';
</script>

<div class="modal fade" id="modal-visite">
	<div class="modal-dialog modal-dialog-centered modal-sm">
		<div class="modal-content">
			<div class="modal-header">
				<button type="submit" class="btn btn-success btn-lg p-4"
					><i class=" fas fa-stethoscope fa-3x"></i></button
				>
				<button type="submit" class="btn btn-danger btn-lg p-4"
					><i class=" fas fa-procedures fa-3x"></i></button
				>
			</div>
		</div>
	</div>
</div>

<div class="row">
	<div class="col-sm-6">
		<h2>IPD</h2>
	</div>
	<div class="col-sm-6">
		<ol class="breadcrumb justify-content-end">
			<li class="breadcrumb-item">
				<a href="/dashboard" class="btn btn-link p-0 text-secondary"
					><i class="fas fa-tachometer-alt"></i>
					Home
				</a>
			</li>
			<li class="breadcrumb-item">
				<a href="/patient/all" class="btn btn-link p-0 text-secondary"
					><i class="nav-icon fas fa-procedures"></i>
					Patient IPD
				</a>
			</li>
		</ol>
	</div>
</div>

<div class="row">
	<div class="col-12">
		<div class="card">
			<div class="card-header">
				<!-- <h3 class="card-title">Fixed Header Table</h3> -->
				<div class="row">
					<div class="col">
						<input
							type="text"
							name="table_search"
							class="form-control float-right"
							placeholder="Search"
						/>
					</div>
				</div>
			</div>
			<div style="max-height: {$inerHight};" class="card-body table-responsive p-0">
				<table class="table table-bordered">
					<thead class="sticky-top bg-light table-active">
						<tr>
							<th style="width: 5%; " class="text-center">ID</th>
							<th>Dates</th>
							<th>Patient</th>
							<th>Etiology</th>
							<th>Department</th>
							<th>Doctor</th>
							<th>Room</th>
							<th>Doc</th>
							<th>Visit</th>
							<th>Pay</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody class="table-sm">
						{#each get_pregress_notes as item}
							<tr>
								<td class="text-center">{item.id}</td>
								<td
									>{new Intl.DateTimeFormat('en-GB', { dateStyle: 'short' })
										.format(new Date(item.date_checkup ?? ''))
										.split('/')
										.join('-')} <br />
									{new Intl.DateTimeFormat('en-GB', {
										timeStyle: 'short',
										hour12: true
									}).format(new Date(item.date_checkup ?? ''))}
								</td>
								<td>
									<a href="/ipd/{item.id}/progress-note">
										<span class="">
											{item.patient?.name_khmer}
										</span>
										<br />
										<span class="badge text-bg-primary">
											{item.patient?.name_latin}
										</span>
									</a>
								</td>
								<td>{item.visit[0]?.etiology ?? ''}</td>
								<td>{item.visit[0]?.department?.department}</td>
								<td>{item.visit[0]?.staff?.name}</td>
								<td></td>
								<td></td>
								<td
									><div>
										<a class="btn btn-secondary btn-sm" href="/{item.id}/subjective"
											><i class="fas fa-share-square"></i></a
										>
									</div></td
								>
								<td></td>
								<td> </td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
