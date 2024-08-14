<script lang="ts">
	import '$lib/ckeditor5/ckeditor5.css';
	import Ckeditor from '$lib/components/etc/Ckeditor.svelte';
	let value = 'dfsd';
	let value1 = '';
</script>

{value}
{value1}
<Ckeditor height="200px" bind:value name="abcd" />
<Ckeditor height="200px" bind:value={value1} name='myab' />

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
