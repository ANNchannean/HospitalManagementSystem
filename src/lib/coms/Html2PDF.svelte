<script lang="ts">
	import { onMount } from 'svelte';
	export let id: string;
	let html2pdf_: any;
	onMount(async () => {
		// @ts-ignore
		const html2pdf = await import('html2pdf.js');
		html2pdf_ = new html2pdf.default();
	});
	function handleClick() {
		const element = document.getElementById(id);
		const opt = {
			margin: 15,
			filename: 'filename',
			image: { type: 'jpeg', quality: 1 },
			pagebreak: { avoid: [], mode: 'css' },
			html2canvas: { scale: 2, letterRendering: true, useCORS: true },
			jsPDF: { unit: 'mm', format: [463, 282], orientation: 'portrait', pagesplit: true }
		};
		html2pdf_
			.from(element)
			.set(opt)

			.toPdf()
			.get('pdf')
			.then(function (pdf: any) {
				const totalPages = pdf.internal.getNumberOfPages();
				//print current pdf width & height to console
				console.log('getHeight:' + pdf.internal.pageSize.getHeight());
				console.log('getWidth:' + pdf.internal.pageSize.getWidth());
				for (let i = 1; i <= totalPages; i++) {
					pdf.setPage(i);
					pdf.setFontSize(10);
					pdf.setTextColor(150);
					pdf.text(
						pdf.internal.pageSize.getWidth() - 30,
						pdf.internal.pageSize.getHeight() - 10,
						'Page ' + i + ' of ' + totalPages
					);
				}
			})
			.save();
	}
</script>

<button class="btn btn-link" on:click={handleClick} type="button">PDF</button>
