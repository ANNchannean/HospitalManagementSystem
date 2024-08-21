<script lang="ts">
	import { browser } from '$app/environment';
	import type { ClassicEditor } from 'ckeditor5';
	// import 'ckeditor5/ckeditor5.css';
	import { onDestroy, onMount } from 'svelte';
	export let name: string;
	export let height = 400;
	export let setValue = '';
	export let getValue = '';
	export let id = 'myid';

	let theEditor: ClassicEditor;
	$: {
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
				List,
				Alignment,
				TableColumnResize,
				TableProperties,
				TableCellProperties,
				FullPage
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
						editor.model.document.on('change:data', () => {
							getValue = editor.getData();
						});
						editor.editing.view.change((writer: any) => {
							writer.setStyle(
								'height',
								String(height).concat('px'),
								editor.editing.view.document.getRoot()
							);
						});

						// (window as any).editor = editor;
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
	$: {
		if (browser) {
			theEditor?.setData(setValue);
		}
	}
</script>

<div>
	<textarea {name} {id}>
		{getValue}
	</textarea>
</div>
