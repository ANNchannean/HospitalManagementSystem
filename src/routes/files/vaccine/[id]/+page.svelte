<script lang="ts">
	import '$lib/font/KhmerOSMoulLight-normal';
	import '$lib/font/KhmerOSbattambang-normal';
	import '$lib/font/KhmerOSmuol-normal';
	import { jsPDF } from 'jspdf';
	import type { PageServerData } from './$types';
	import { onMount } from 'svelte';
	export let data: PageServerData;
	$: ({ get_clinichinfo } = data);
	let dataURL: string;
	let img = '/files/'.concat(get_clinichinfo?.fileOrPicture[0]!.filename ?? '');
	onMount(() => {
		const doc = new jsPDF();
		const logo2 = '/';
		doc.addFont('KhmerOSbattambang-normal.ttf', 'KhmerOSBattambang', 'normal');
		doc.addFont('KhmerOSMoulLight-normal.ttf', 'KhmerOSMoulLight', 'normal');
		doc.addFont('KhmerOSmuol-normal.ttf', 'KhmerOSmuol', 'normal');
		doc.setFont('KhmerOSBattambang');
		doc.setLanguage('th');
		doc.text('សដសា', 10, 10);
		doc.addPage();
		doc.addImage(
			'http://localhost:5173/files/'.concat(get_clinichinfo?.fileOrPicture[0]!.filename ?? ''),
			'JPEG',
			15,
			40,
			180,
			160
		);
		doc.text('សួស្ដី', 10, 10);
		const pageCount = doc.getNumberOfPages();
		for (let i = 1; i <= pageCount; i++) {
			doc.setPage(i);
			doc.text(`Page ${i} + Of ${pageCount}`, 210 - 50, 297 - 20);
		}
		doc.addPage();
		dataURL = doc.output('dataurlstring');
	});
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<!-- <iframe
	src={dataUIrl}
	frameborder="0"
	allowfullscreen
></iframe> -->
<!-- svelte-ignore a11y-missing-attribute -->
<enhanced:img src={img} alt="An alt text" />
