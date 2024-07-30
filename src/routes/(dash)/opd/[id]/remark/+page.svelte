<script lang="ts">
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import DeleteModal from '$lib/components/etc/DeleteModal.svelte';
	import SubmitButton from '$lib/components/etc/SubmitButton.svelte';
	import { onDestroy, onMount } from 'svelte';
	import type { PageServerData } from './$types';
	import TextEditor from '$lib/components/etc/TextEditor.svelte';
	export let data: PageServerData;
	$: ({ get_remark } = data);
	let loading = false;
</script>

<DeleteModal action="?/delete_remark" id={get_remark?.id} />

<div class="card">
	<div class="card-header fs-4">
		<span># Remark</span>
	</div>
	<form
		enctype="multipart/form-data"
		use:enhance={() => {
			loading = true;
			return async ({ update, result }) => {
				await update();
				loading = false;
			};
		}}
		action="?/create_remark"
		method="post"
		class="form-horizontal"
	>
		<div class="card-body">
			<div class="form-group row">
				<label for="ramark" class="col-sm-3 col-form-label">Doctor's Comment</label>
				<div class="col-sm-9">
					<TextEditor
						height={200}
						id={get_remark?.id.toString()}
						name="description"
						setValue={get_remark?.description ?? ''}
					/>
				</div>
			</div>
			<div class="float-end py-4">
				<SubmitButton {loading} />
			</div>
		</div>
	</form>
</div>
