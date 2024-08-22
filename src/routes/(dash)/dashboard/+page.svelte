<script lang="ts">
	// import 'quill/dist/quill.snow.css';
	import { onMount } from 'svelte';
	let setValue = '';
	let getValue = '';
	
	// onMount(async () => {
	// 	const Quill = await import('quill');
	// 	const container = document.getElementById('editor') as HTMLElement;
	// 	const q = Quill.default || undefined;
	// 	const toolbarOptions = [
	// 		// font options
	// 		[{ font: [] }],

	// 		//   header options
	// 		[{ header: [1, 2, 3] }],

	// 		// text utilities
	// 		['bold', 'italic', 'underline', 'strike'],

	// 		// text colors and bg colors
	// 		[{ color: [] }, { background: [] }],

	// 		// lists
	// 		[{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],

	// 		// block quotes and code blocks
	// 		['blockquote', 'code-block'],

	// 		// media
	// 		['link', 'image', 'video'],

	// 		// alignment
	// 		[{ align: [] }]
	// 	];

	// 	const quill = new q(container, {
	// 		theme: 'snow',
	// 		modules: {
	// 			toolbar: toolbarOptions,
	// 			table: true
	// 		}
	// 	});

	// 	const toolbar = quill.getModule('table-embed') as any;
	// 	if (toolbar) {
	// 		toolbar.addHandler('table', () => {
	// 			var table = quill.getModule('table') as any;

	// 			if (table) {
	// 				table.insertTable(3, 3);
	// 			}
	// 		});
	// 	}
	// });
</script>

<div class="container">
	<div id="editor">This is the inline text</div>
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
