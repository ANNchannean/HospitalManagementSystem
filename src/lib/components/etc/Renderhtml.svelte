<script lang="ts">
	import { browser } from '$app/environment';
	import type { ClassicEditor } from 'ckeditor5';
	import { onDestroy, onMount } from 'svelte';
	export let value: string;
	export let id: string;
	let theEditor: ClassicEditor;
	$: {
		onMount(async () => {
			const {
				ClassicEditor,
				FullPage,
				Essentials,
				Paragraph,
				Bold,
				Italic,
				Font,
				Table,
				TableToolbar,
				Undo,
				List,
				Alignment,
				TableColumnResize
			} = await import('ckeditor5');
			if (browser) {
				const editorPlaceholder = document.querySelector(`#${id}`) as HTMLElement;
				await ClassicEditor.create(editorPlaceholder, {
					fontFamily: {
						options: ['TimesNewRoman', 'KhmerOSMuol', 'KhmerOSMuolLight', 'KhmerOSBattambang']
					},
					fontSize: {
						options: [9, 11, 13, 'default', 17, 19, 21]
					},
					plugins: [
						FullPage,
						Essentials,
						Paragraph,
						Bold,
						Italic,
						Font,
						Table,
						TableToolbar,
						Undo,
						List,
						Alignment,
						TableColumnResize
					],
					toolbar: [
						'undo',
						'redo',
						'|',
						'fontFamily',
						'fontSize',
						'|',
						'alignment',
						'bulletedList',
						'numberedList',
						'bold',
						'italic',
						'|',
						'fontColor',
						'fontBackgroundColor',
						'insertTable',
						'tableColumn',
						'tableRow',
						'mergeTableCells'
					]
					// table: {
					// 	contentToolbar: [
					// 		'tableColumn',
					// 		'tableRow',
					// 		'mergeTableCells',
					// 		'tableProperties',
					// 		'tableCellProperties'
					// 	]
					// }
				})
					.then((editor) => {
						// (window as any).editor = editor;
						const toolbarElement = editor.ui.view.toolbar.element as HTMLElement;
						toolbarElement.style.display = 'none';
						editor.enableReadOnlyMode(`#${id}`);
						theEditor = editor;
						editor?.sourceElement?.focus();
					})
					.catch((error) => {
						console.error(error);
					});
			}
		});
	}

	onDestroy(() => {
		if (browser) {
			theEditor.destroy();
		}
	});
</script>

<div {id}>
	{value}
</div>
