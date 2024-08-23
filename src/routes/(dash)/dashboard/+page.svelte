<script lang="ts">
	import { browser } from '$app/environment';
	import 'suneditor/dist/css/suneditor.min.css';
	import { onDestroy, onMount } from 'svelte';
	let getValue = '';
	let setValue = '';
	let editor: any;
	onMount(async () => {
		const suneditor = await import('suneditor');
		const plugins = await import('suneditor/src/plugins');
		const sum = suneditor.default as any;
		const id = document.getElementById('one');
		const initEditor = sum.init({
			plugins: plugins,
			height: 500,
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
		editor = initEditor.create(id, {
			// The value of the option argument put in the "create" function call takes precedence
			font: ['KhmerOSMuolLight', 'KhmerOSMuol', 'KhmerOSBattambang', 'TimesNewRoman']
		});
		editor.onChange = function (contents: any, core: any) {
			console.log('onChange', contents);
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

<textarea class="form-control" id="one">fsdfsdf</textarea>
<hr />
{@html getValue}
<input class="form-control" type="text" name="" bind:value={setValue} id="" />
<h1 class="m-0">Dashbaord</h1>
<ol class="breadcrumb float-sm-right">
	<li class="breadcrumb-item"><a href="/">Home</a></li>
	<li class="breadcrumb-item active">Dashboard</li>
</ol>

<div class="row">
	<div class="col-lg-3 col-6">
		<div class="small-box bg-primary">
			<div class="inner">
				<h3>150</h3>
				<p>Patients</p>
			</div>
			<div class="icon">
				<i class="ion ion-bag"></i>
			</div>
			<a href="/" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
		</div>
	</div>
	<div class="col-lg-3 col-6">
		<div class="small-box bg-info">
			<div class="inner">
				<h3>150</h3>
				<p>IPD</p>
			</div>
			<div class="icon">
				<i class="ion ion-bag"></i>
			</div>
			<a href="/" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
		</div>
	</div>
	<div class="col-lg-3 col-6">
		<div class="small-box bg-warning">
			<div class="inner">
				<h3>150</h3>
				<p>OPD</p>
			</div>
			<div class="icon">
				<i class="ion ion-bag"></i>
			</div>
			<a href="/" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
		</div>
	</div>

	<div class="col-lg-3 col-6">
		<div class="small-box bg-success">
			<div class="inner">
				<h3>150</h3>
				<!-- <h3>53<sup style="font-size: 20px">%</sup></h3> -->
				<p>Laboratory</p>
			</div>
			<div class="icon">
				<i class="ion ion-stats-bars"></i>
			</div>
			<a href="/" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
		</div>
	</div>
	<div class="col-lg-3 col-6">
		<div class="small-box bg-dark">
			<div class="inner">
				<h3>44</h3>
				<p>Imagerie</p>
			</div>
			<div class="icon">
				<i class="ion ion-person-add"></i>
			</div>
			<a href="/" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
		</div>
	</div>

	<div class="col-lg-3 col-6">
		<div class="small-box bg-secondary">
			<div class="inner">
				<h3>65</h3>
				<p>Prescription</p>
			</div>
			<div class="icon">
				<i class="ion ion-pie-graph"></i>
			</div>
			<a href="/" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
		</div>
	</div>
	<div class="col-lg-3 col-6">
		<div class="small-box bg-info">
			<div class="inner">
				<h3>65</h3>
				<p>Vaccine</p>
			</div>
			<div class="icon">
				<i class="ion ion-pie-graph"></i>
			</div>
			<a href="/" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
		</div>
	</div>
	<div class="col-lg-3 col-6">
		<div class="small-box bg-danger">
			<div class="inner">
				<h3>65</h3>
				<p>Documents</p>
			</div>
			<div class="icon">
				<i class="ion ion-pie-graph"></i>
			</div>
			<a href="/" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
		</div>
	</div>
</div>
