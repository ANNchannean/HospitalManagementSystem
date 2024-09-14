<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageServerData } from './$types';
	import { dobToAge } from '$lib/helper';
	import Renderhtml from '$lib/coms/Renderhtml.svelte';
	import ClinichInfo from '$lib/coms-report/ClinichInfo.svelte';
	import { page } from '$app/stores';
	import DateTimeFormat from '$lib/coms/DateTimeFormat.svelte';
	import InvoiceBody from '$lib/coms-report/InvoiceBody.svelte';
	import InvoiceHeader from '$lib/coms-report/InvoiceHeader.svelte';
	export let data: PageServerData;
	$: ({ get_billing, get_clinic_info, get_currency } = data);
	let isPrint = $page.url.searchParams.get('print');
	onMount(async () => {
		document.addEventListener('keydown', function (event) {
			window.scrollTo({ top: 0, behavior: 'smooth' });
			if (event.ctrlKey && event.key === 'p') {
				// event.preventDefault();
				// alert('View only');
			}
		});

		if (isPrint === 'true') {
			setTimeout(async () => {
				window.print();
				window.close();
			}, 300);
		}
	});
</script>

<div id="pdf" class="row pt-4 justify-content-center">
	<div style="width: 1200px;">
		<div class="header">
			<ClinichInfo data={{ get_clinic_info }} />
			<hr />
			<InvoiceHeader />
		</div>
		<table class="">
			<thead>
				<div class="header-space">&nbsp;</div>
			</thead>
			<tbody>
				<InvoiceBody data={{get_billing,get_currency}} />
			</tbody>
			<tfoot>
				<div class="footer-space">&nbsp;</div>
			</tfoot>
		</table>
		<div class="footer">
			<div style="font-size: 110%;" class="en_font_times_new_roman row">
				<div class="col-4 text-center">
					<span style="font-size: 100%;" class="kh_font_battambang"> ថ្ងៃទី </span>
					<span class="kh_font_battambang"> ខែ </span>

					<span class="kh_font_battambang"> ឆ្នាំ </span>

					<p>Sign's Physician</p>
					<br />
					<p>My Name is</p>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	@media print {
		.footer,
		.footer-space {
			min-height: 200px;
		}
		.footer {
			width: 100%;
			position: fixed;
			bottom: 0;

			/* padding-bottom: 10mm; */
			/* margin-top: 20mm; */
			padding-top: 10mm;
			/* margin-bottom: 5mm; */
		}
		/* .noprint {
			visibility: hidden;
		} */
	}
</style>
