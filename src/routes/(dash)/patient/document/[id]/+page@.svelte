<script lang="ts">
	import type { PageServerData } from './$types';
	import Athtml from '$lib/components/etc/Athtml.svelte';
	import SubmitButton from '$lib/components/etc/SubmitButton.svelte';
	import { enhance } from '$app/forms';
	import type { EventHandler } from 'svelte/elements';
	export let data: PageServerData;
	const { get_document, get_visit, get_clinicinfo } = data;

	let loading = false;
	let document_content = get_document.content
		?.replace('name_khmer', get_visit?.patient?.name_khmer ?? '')
		.replace('name_latin', String(get_visit?.patient?.name_latin ?? ''))
		.replace('gender', String(get_visit?.patient?.gender ?? ''))
		.replace('dob', String(get_visit?.patient?.gender ?? ''))
		.replace('clinic_name', get_clinicinfo?.title_khm!)
		.replace(
			'date_visit',
			new Intl.DateTimeFormat('en-GB', { dateStyle: 'short' }).format(
				new Date(get_visit?.date_checkup!)
			)
		)
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
	let timeout: number | NodeJS.Timeout;
	const handleQ: EventHandler<Event, HTMLInputElement> = ({ currentTarget }) => {
		clearTimeout(timeout);
		const form = currentTarget?.form;
		if (!form) return;
		timeout = setTimeout(() => {
			form.requestSubmit();
		}, 400);
	};
</script>

<div class="col-12 bg-secondary">
	<div class="row justify-content-center">
		<div style="width: 1200px;margin-left: 1.5cm; margin-right: 1.5cm;">
			<div class="bg-light">
				<div class="header">
					<div class="row">
						<h2 style="font-size: 140%;" class="text-center kh_font_muol_light">
							ព្រះរាជាណាចក្រកម្ពុជា
						</h2>
						<h2 style="font-size: 130%;" class="text-center kh_font_muol_light">
							ជាតិ សាសនា ព្រះមហាក្សត្រ
						</h2>
						<h2 class="text-center kh_font_muol">*****</h2>
						<div class="col-12">
							<div class="text-start">
								<img
									id="imgp1"
									height="130px"
									class="float-right"
									src="/files/{get_clinicinfo?.fileOrPicture[0]?.filename}"
									alt="no logo"
								/>
							</div>
							<div class="col-12 text-start pt-2">
								<p style="font-size: 140%;color:#0000FF" class="kh_font_muol m-0">
									{get_clinicinfo?.title_khm ?? ''}
								</p>
								<p style="font-size: 130%;color:#0000FF" class="en_font_times_new_roman m-0">
									{get_clinicinfo?.title_eng ?? ''}
								</p>
							</div>
						</div>
					</div>
				</div>

				<table>
					<thead
						><tr
							><td>
								<div class="header-space">&nbsp;</div>
							</td></tr
						></thead
					>
					<tbody
						><tr
							><td>
								<Athtml contenteditable={true} bind:html={document_content} />
							</td></tr
						></tbody
					>
					<tfoot
						><tr
							><td>
								<div class="footer-space">&nbsp;</div>
							</td></tr
						></tfoot
					>
				</table>

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
					<div class="text-end">
						<button
							type="button"
							on:click={() => {
								window.print();
							}}
							class="btn btn-primary">Print</button
						>
					</div>
				</form>
				<div class="footer">
					<div>
						<hr class="mt-0" />
						<h6 style="color:#0000FF" class="text-center">
							{get_clinicinfo?.address ?? ''}
						</h6>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	@media print {
		.header,
		.header-space,
		.footer,
		.footer-space {
			height: 320px;
		}
		.header {
			position: fixed;
			top: 0;
			height: 50px;
		}
		.footer {
			position: fixed;
			bottom: 0;
		}
	}
</style>
