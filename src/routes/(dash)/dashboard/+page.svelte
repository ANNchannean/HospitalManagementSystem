<script lang="ts">
	import { browser } from '$app/environment';
	import '$lib/ckeditor5/ckeditor5.css';
	import { onDestroy, onMount } from 'svelte';
	let id = 'myid';
	let value = 'dsafd';
	let height = '400px';
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
			const editorPlaceholder = document.querySelector(`#${id}`) as HTMLElement;
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
					editor.editing.view.change((writer: any) => {
						writer.setStyle('height', height, editor.editing.view.document.getRoot());
					});
					(window as any).editor = editor;
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

<div class="form-group">
	<textarea
		rows="10"
		cols="10"
		class="form-control"
		{id}
		placeholder="Enter the Description"
		name="body"
	></textarea>
</div>
<div id="editor">
	<p>{value}</p>
</div>

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
