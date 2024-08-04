<script lang="ts">
	import type { PageServerData } from './$types';
	import Athtml from '$lib/components/etc/Athtml.svelte';
	import SubmitButton from '$lib/components/etc/SubmitButton.svelte';
	import { enhance } from '$app/forms';
	export let data: PageServerData;
	const { get_document, get_visit, get_clinicinfo} = data;

	let loading = false;
	let document_content = get_document.content
		?.replace('name_khmer', get_visit?.patient?.name_khmer ?? '')
		.replace('name_latin', String(get_visit?.patient?.name_latin ?? ''))
		.replace('gender', String(get_visit?.patient?.gender ?? ''))
		.replace('dob', String(get_visit?.patient?.gender ?? ''))
		.replace('clinic_name', get_clinicinfo?.title_khm!)
		.replace('date_visit',new Intl.DateTimeFormat('en-GB',{dateStyle:'short'}).format(new Date(get_visit?.date_checkup!)))
		.replace(
			'address',
			String(get_visit?.patient?.village?.type)
				.concat(' ')
				.concat(get_visit?.patient?.village?.name_khmer ?? '')
				.concat(' ')
				.concat(get_visit?.patient?.commune?.type ?? '')
				.concat(' ')
				.concat(get_visit?.patient?.commune?.name_khmer ?? '')
				.concat(' ')
				.concat(get_visit?.patient?.district?.type ?? '')
				.concat(' ')
				.concat(get_visit?.patient?.district?.name_khmer ?? '')
				.concat(' ')
				.concat(get_visit?.patient?.provice?.type ?? '')
				.concat(' ')
				.concat(get_visit?.patient?.provice?.name_khmer ?? '')
		);
</script>

<div class="a4" style="width: 210mm;height:297mm">
	<Athtml contenteditable={true} bind:html={document_content} />
	<form
		use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				await update({ reset: false });
				loading = false;
			};
		}}
		action="?/update_document"
		method="post"
	>
		<input value={document_content} type="hidden" name="document_content" />
		<input value={get_document.id} type="hidden" name="id" />
		<SubmitButton {loading} />
	</form>
</div>

<style>
	@media print {
		.a4 {
			width: 210mm;
			height: 297mm;
		}
	}
</style>
