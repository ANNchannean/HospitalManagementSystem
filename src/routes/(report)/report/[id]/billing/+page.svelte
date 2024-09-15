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
	$: ({ get_billing, get_clinic_info, get_currency,previous_due } = data);
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
			<InvoiceHeader data={{ get_billing }} />
		</div>
		<table class="w-100">
			<thead>
				<div class="header-space">&nbsp;</div>
			</thead>
			<tbody>
				<InvoiceBody data={{ get_billing, get_currency,previous_due }} />
			</tbody>
			<tfoot>
				<div class="footer-space">&nbsp;</div>
			</tfoot>
		</table>
		<div class="footer">
			<div style="font-size: 110%;" class="en_font_times_new_roman row">
				<div class="col-6 text-center">
					<span>------------------------</span>
					<br />
					<span>ហត្ថលេខាអ្នកបង់ប្រាក់</span>
					<br />
					<span>Sign's Payment</span>
				</div>
				<div class="col-6 text-center">
					<span>------------------------</span>
					<br />
					<span>ហត្ថលេខាអ្នកទទួលប្រាក់</span>
					<br />
					<span>Sign's Cashier</span>
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
		.header,
		.header-space {
			height: 300px;
		}
		.header {
			width: 99%;
			position: fixed;
			top: 1mm;
		}
		.footer {
			width: 100%;
			position: fixed;
			bottom: 0;
			padding-top: 10mm;
		}
	}
</style>
