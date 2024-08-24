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
		const opt = {
			margin: 4,
			filename: 'filename',
			image: { type: 'jpeg', quality: 1 },
			html2canvas: { scale: 3, letterRendering: true, useCORS: true },
			jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', pagesplit: true }
		};
		const element = document.getElementById(id);
		html2pdf_.set(opt).from(element).save();
	}
</script>

<button class="btn btn-link" on:click={handleClick} type="button">PDF</button>
