<script lang="ts">
	import { browser } from '$app/environment';
	import 'suneditor/dist/css/suneditor.min.css';
	import { onDestroy, onMount } from 'svelte';
	export let name: string;
	export let height = 400;
	export let setValue = '';
	export let getValue = '';
	export let id = 'myid';
	let editor: any;
	onMount(async () => {
		const suneditor = await import('suneditor');
		const plugins = await import('suneditor/src/plugins');
		const sum = suneditor.default as any;
		const element = document.getElementById(id);
		const initEditor = sum.init({
			plugins: plugins,
			height: height,
			buttonList: [
				[
					'undo',
					'redo',
					'font',
					'fontSize',
					'formatBlock',
					// 'paragraphStyle',
					// 'blockquote',
					'bold',
					'underline',
					'italic',
					'strike',
					'subscript',
					'superscript',
					'fontColor',
					'hiliteColor',
					// 'textStyle',
					'removeFormat',
					'outdent',
					'indent',
					'align',
					'horizontalRule',
					'list',
					'lineHeight',
					'table',
					// 'link',
					// 'image',
					// 'video',
					// 'audio' /** 'math', */, // You must add the 'katex' library at options to use the 'math' plugin.
					/** 'imageGallery', */ // You must add the "imageGalleryUrl".
					'fullScreen',
					'showBlocks',
					'codeView'
					// 'preview',
					// 'print',
					// 'save'

					/** 'dir', 'dir_ltr', 'dir_rtl' */ // "dir": Toggle text direction, "dir_ltr": Right to Left, "dir_rtl": Left to Right
				]
			]
		});
		editor = initEditor.create(element, {
			// The value of the option argument put in the "create" function call takes precedence
			font: ['KhmerOSBattambang', 'KhmerOSMuolLight', 'KhmerOSMuol', 'TimesNewRoman'],

			defaultStyle: 'font-size:18px;font-family:KhmerOSBattambang'
		});
		editor.onChange = function (contents: any, core: any) {
			getValue = contents;
		};
	});
	onDestroy(() => {
		if (browser && editor) {
			editor.destroy();
		}
	});
	$: {
		if (browser && editor) {
			editor.setContents(setValue);
		}
	}
</script>

<div>
	<textarea class="form-control" {name} {id}>
		{getValue}
	</textarea>
</div>
