<script lang="ts">
	import { browser } from '$app/environment';
	import '$lib/ckeditor5/ckeditor5.css';
	import { onDestroy, onMount } from 'svelte';
	export let value = 'dsafd';
	export let name: string;
	export let height = '400px';
	onMount(async () => {
		const {
			ClassicEditor,
			Essentials,
			Bold,
			Italic,
			Font,
			Paragraph,
			TableToolbar,
			Table,
			Undo,
			List
		} = await import('$lib/ckeditor5/ckeditor5');
		if (browser) {
			const editorPlaceholder = document.querySelector(`#${name}`) as HTMLElement;
			await ClassicEditor.create(editorPlaceholder, {
				fontFamily: {
					options: ['TimesNewRoman', 'KhmerOSMuol', 'KhmerOSMuolLight', 'KhmerOSBattambang']
				},
				fontSize: {
					options: [9, 11, 13, 'default', 17, 19, 21]
				},
				plugins: [Essentials, Paragraph, Bold, Italic, Font, Table, TableToolbar, Undo, List],
				toolbar: [
					'undo',
					'redo',
					'|',
					'fontFamily',
					'fontSize',
					'|',
					'bulletedList',
					'numberedList',
					'bold',
					'italic',
					'|',
					'fontColor',
					'fontBackgroundColor',
					'insertTable'
				],
				table: {
					contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
				}
			})
				.then((editor) => {
					editor.model.document.on('change:data', () => {
						value = editor.getData();
					});
					editor.editing.view.change((writer: any) => {
						writer.setStyle('height', height, editor.editing.view.document.getRoot());
					});
				
				})
				.catch((error) => {
					console.error(error);
				});
		}
	});

	onDestroy(() => {
		if (browser) {
			(window as any).editor.destroy();
		}
	});
</script>
{#if name }
    
<textarea {value} class="form-control" id={name} placeholder="Enter the Description" {name}
></textarea>
{/if}
