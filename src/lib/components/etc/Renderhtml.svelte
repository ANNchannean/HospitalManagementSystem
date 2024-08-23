<script lang="ts">
	import { browser } from '$app/environment';
	import 'suneditor/dist/css/suneditor.min.css';
	import { onDestroy, onMount } from 'svelte';
	export let value: string;
	const id = Date.now().toString();
	let editor: any;
	onMount(async () => {
		const suneditor = await import('suneditor');
		const plugins = await import('suneditor/src/plugins');
		const sum = suneditor.default as any;
		const element = document.getElementById(id);
		const initEditor = sum.init({
			plugins: plugins,
			buttonList: [
				[
					'undo',
					'redo',
					'font',
					'fontSize',
					'formatBlock',
					'paragraphStyle',
					'blockquote',
					'bold',
					'underline',
					'italic',
					'strike',
					'subscript',
					'superscript',
					'fontColor',
					'hiliteColor',
					'textStyle',
					'removeFormat',
					'outdent',
					'indent',
					'align',
					'horizontalRule',
					'list',
					'lineHeight',
					'table',
					'link',
					'image',
					'video',
					'audio' /** 'math', */, // You must add the 'katex' library at options to use the 'math' plugin.
					/** 'imageGallery', */ // You must add the "imageGalleryUrl".
					'fullScreen',
					'showBlocks',
					'codeView',
					'preview',
					'print',
					'save'

					/** 'dir', 'dir_ltr', 'dir_rtl' */ // "dir": Toggle text direction, "dir_ltr": Right to Left, "dir_rtl": Left to Right
				]
			]
		});
		editor = initEditor.create(element, {
			// The value of the option argument put in the "create" function call takes precedence
			font: ['KhmerOSMuolLight', 'KhmerOSMuol', 'KhmerOSBattambang', 'TimesNewRoman']
		});
		editor.setOptions({
			width: '100%',
			height: '100%'
		});
		editor.readOnly(true);
		editor.toolbar.hide();
	});
	onDestroy(() => {
		if (browser && editor) {
			editor.destroy();
		}
	});
	$: {
		if (browser && editor) {
			editor.setContents(value);
		}
	}
</script>

<textarea class="" {id}>{value} </textarea>
