<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';
	export let data: PageServerData;
	$: ({ picture } = data);
</script>

<div class="d-flex gap-5 justify-content-center">
	<div
		class="dropdown-menu d-block position-static pt-0 mx-0 rounded-3 shadow overflow-hidden w-280px"
	>
		<form class="p-2 mb-2 bg-light border-bottom">
			<input
				type="search"
				class="form-control"
				autocomplete="false"
				placeholder="Type to filter..."
			/>
		</form>
		<ul class="list-unstyled mb-0">
			<li>
				<a class="dropdown-item d-flex align-items-center gap-2 py-2" href="#">
					<span class="d-inline-block bg-success rounded-circle p-1"></span>
					Action
				</a>
			</li>
			<li>
				<a class="dropdown-item d-flex align-items-center gap-2 py-2" href="#">
					<span class="d-inline-block bg-primary rounded-circle p-1"></span>
					Another action
				</a>
			</li>
			<li>
				<a class="dropdown-item d-flex align-items-center gap-2 py-2" href="#">
					<span class="d-inline-block bg-danger rounded-circle p-1"></span>
					Something else here
				</a>
			</li>
			<li>
				<a class="dropdown-item d-flex align-items-center gap-2 py-2" href="#">
					<span class="d-inline-block bg-info rounded-circle p-1"></span>
					Separated link
				</a>
			</li>
		</ul>
	</div>
</div>

<form use:enhance enctype="multipart/form-data" action="?/img" method="post">
	<input class="form-control" name="file" type="file" alt="" />
	<button type="submit">Submit</button>
</form>

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
