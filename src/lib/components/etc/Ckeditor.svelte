<script lang="ts">
	import { browser } from '$app/environment';
	import type { ClassicEditor } from 'ckeditor5';
	import { onDestroy, onMount } from 'svelte';
	export let name: string;
	export let height = '400';
	export let setValue = '';
	export let getValue = '';

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
				List,Alignment
			} = await import('ckeditor5');
			if (browser) {
				const editorPlaceholder = document.querySelector(`#${name}`) as HTMLElement;
				await ClassicEditor.create(editorPlaceholder, {
					fontFamily: {
						options: ['TimesNewRoman', 'KhmerOSMuol', 'KhmerOSMuolLight', 'KhmerOSBattambang']
					},
					fontSize: {
						options: [9, 11, 13, 'default', 17, 19, 21]
					},
					plugins: [Essentials, Paragraph, Bold, Italic, Font, Table, TableToolbar, Undo,Alignment, List],
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
						'insertTable'
					],
					table: {
						contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
					},
					ui: {
						viewportOffset: {}
					}
				})
					.then((editor) => {
						editor.model.document.on('change:data', () => {
							getValue = editor.getData();
						});
						editor.editing.view.change((writer: any) => {
							writer.setStyle(
								'height',
								height.concat('px'),
								editor.editing.view.document.getRoot()
							);
						});

						(window as any).editor = editor;
						theEditor = editor;
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

<textarea class="form-control" {name} id={name}>
	{setValue}
</textarea>
