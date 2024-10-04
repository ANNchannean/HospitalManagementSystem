<script lang="ts">
	import type { PageServerData } from './$types';
	import { enhance } from '$app/forms';
	import DeleteModal from '$lib/coms/DeleteModal.svelte';
	import { _ } from '$lib/translations';
	import { globalLoading } from '$lib/store';
	export let data: PageServerData;
	let backup_name = '';
	let loading = false;
	$: ({ file_list } = data);
	let file: any;
</script>

<DeleteModal action="?/delete" slug={backup_name} />

<div class="row">
	<div class="col-sm-6">
		<h1 class="m-0">{$_('backup_list')}</h1>
	</div>
	<div class="col-sm-6">
		<ol class="breadcrumb justify-content-end">
			<li class="breadcrumb-item">
				<a href="/dashboard" class="btn btn-link p-0 text-secondary"
					><i class="fas fa-tachometer-alt"></i>
					{$_('home')}
				</a>
			</li>
			<li class="breadcrumb-item">
				<a href={'#'} class="btn btn-link p-0 text-secondary"
					><i class="fa-solid fa-database"></i>
					{$_('backup')}
				</a>
			</li>
		</ol>
	</div>
</div>
<br />
<div class="row">
	<div class="col-12">
		<div class="card">
			<div class="card-header">
				<form
					class="card-tools"
					enctype="multipart/form-data"
					method="post"
					use:enhance={() => {
						$globalLoading = true;
						loading = true;
						return async ({ update }) => {
							await update();
							loading = false;
							$globalLoading = false;
						};
					}}
					action="?/backup"
				>
					<div class="row pb-2">
						<div class="col-sm-6">
							<input
								bind:value={file}
								type="file"
								name="sql"
								accept=".sql"
								class="custom-file-input"
								id="exampleInputFile"
							/>
						</div>
						<div class="col-sm-6">
							<button disabled={!file} type="submit" class="btn btn-info">
								<i class="fa-solid fa-arrows-rotate"></i>
								{$_('restore')}
							</button>
							<button formaction="?/backup" class="btn btn-success">
								<i class="fa-solid fa-database"></i>
								{$_('backup')}
							</button>
						</div>
					</div>
				</form>

				<div class="card-body table-responsive p-0">
					<table class="table text-nowrap">
						<tbody>
							{#each file_list || [] as item}
								{@const datetime = item
									.split('hms_')
									.join('')
									.split('_')
									.join(' ')
									.split('.sql')
									.join('')
									.split('.')
									.join(':')}
								<tr>
									<td style="width: 5%;">{$_('date')}</td>
									<td style="width: 20%;"
										>{new Intl.DateTimeFormat('en-GB', {
											dateStyle: 'short',
											timeStyle: 'short',
											hour12: true
										}).format(new Date(datetime))}</td
									>

									<td>
										<div>
											<form
												use:enhance={() => {
													loading = true;
													$globalLoading = true;
													return async ({ update }) => {
														await update();
														loading = false;
														$globalLoading = false;
													};
												}}
												action="?/restore"
												method="post"
											>
												<input type="hidden" value={item} name="name_backup" />
												<button type="submit" class="btn btn-info btn-sm"
													><i class="fa-solid fa-arrows-rotate"></i>
													{$_('restore')}
												</button>
												<a download href="/backup/{item}" class="btn btn-success btn-sm"
													><i class="fa-solid fa-download"></i> {$_('download')}
												</a>
												<a
													href={'#'}
													on:click={() => {
														backup_name = '';
														backup_name = item || '';
													}}
													type="button"
													class="btn btn-danger btn-sm"
													data-bs-toggle="modal"
													data-bs-target="#delete_modal"
													><i class="fa-solid fa-trash-can"></i>
													{$_('delete_backup')}
												</a>
											</form>
										</div>
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
