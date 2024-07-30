<script lang="ts">
	import { browser } from '$app/environment';
	import { onDestroy } from 'svelte';
	export let setValue = '';
	export let getValue = '';
	export let name = '';
	export let id = 'myid';
	export let height = 400;
	$: {
		if (browser) {
			const $ = (window as any).$;
			$(document).ready(function () {
				$(`#${id}`).summernote({
					toolbar: [
						// [groupName, [list of button]]
						['fontstyle', ['fontname', 'fontsize']],
						['style', ['bold', 'italic', 'underline', 'clear']],
						['font', ['strikethrough', 'superscript', 'subscript']],
						['color', ['color']],
						['para', ['ul', 'ol', 'paragraph']],
						['height', ['height']],
						['table']
						// ['insert',['picture']],
					],
					tabsize: 2,
					height: height
				});
				$(`#${id}`).summernote('code', setValue);
				$(`#${id}`).on('summernote.change', function () {
					getValue = $(`#${id}`).summernote('code');
				});
			});
		}
	}
	onDestroy(() => {
		if (browser) {
			const $ = (window as any).$;
			$(document).ready(function () {
				$(`#${id}`).summernote('destroy');
			});
		}
	});
</script>

<div>
	<textarea class="form-control" {id} {name} />
</div>
