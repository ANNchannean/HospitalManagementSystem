<script lang="ts">
	import '$lib/font/KhmerOSMoulLight-normal';
	import '$lib/font/KhmerOSbattambang-normal';
	import '$lib/font/KhmerOSmuol-normal';
	import { jsPDF } from 'jspdf';
	import type { PageServerData } from './$types';
	import { onMount } from 'svelte';
	export let data: PageServerData;
	$: ({ get_clinichinfo } = data);
	$: logo1 = '/files/'.concat(get_clinichinfo?.fileOrPicture[0]?.filename ?? '');
	let dataURL: string;
	onMount(() => {
		const doc = new jsPDF();
		doc.addFont('KhmerOSbattambang-normal.ttf', 'KhmerOSBattambang', 'normal');
		doc.addFont('KhmerOSMoulLight-normal.ttf', 'KhmerOSMoulLight', 'normal');
		doc.addFont('KhmerOSmuol-normal.ttf', 'KhmerOSmuol', 'normal');
		doc.setFont('KhmerOSBattambang');
		doc.text('សដសា', 10, 10);
		doc.addPage();
		doc.addImage(logo1, 'JPEG', 15, 40, 180, 160);
		doc.text('ដសដស', 10, 10);
		const pageCount = doc.getNumberOfPages();
		for (let i = 1; i <= pageCount; i++) {
			doc.setPage(i);
			doc.text(`Page ${i} + Of ${pageCount}`, 210 - 50, 297 - 20);
		}
		doc.addPage();
		dataURL = doc.output('dataurlstring');
	});
</script>
{logo1}
<img src={logo1} alt="">
<!-- svelte-ignore a11y-missing-attribute -->
<!-- <iframe
	src={dataUIrl}
	frameborder="0"
	allowfullscreen
></iframe> -->
<!-- svelte-ignore a11y-missing-attribute -->
<object data={dataURL} type="application/pdf" width="100%" height="100%"> </object>
