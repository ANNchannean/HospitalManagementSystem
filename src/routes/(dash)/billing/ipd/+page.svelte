<script lang="ts">
	import { inerHight } from '$lib/store';
	$: inerHight1 = Number($inerHight.replace('px', '')) - 50;
</script>

<div class="row pt-">
	<div class="col-sm-6">
		<h2>Billing IPD</h2>
	</div>
	<div class="col-sm-6">
		<ol class="breadcrumb justify-content-end">
			<li class="breadcrumb-item">
				<a href="/dashboard" class="btn btn-link p-0 text-secondary"
					><i class="fas fa-tachometer-alt"></i>
					Home
				</a>
			</li>
			<li class="breadcrumb-item">
				<a href={'#'} class="btn btn-link p-0 text-secondary"
					><i class="fas fa-money-bills"></i>
					Billing
				</a>
			</li>
			<li class="breadcrumb-item">
				<a href={'#'} class="btn btn-link p-0 text-secondary"
					><i class=" fas fa-procedures"></i>
					IPD
				</a>
			</li>
		</ol>
	</div>
</div>

<div class="row">
	<div class="col-6">
		<div class="card card-outline card-info">
			<div style="height: {inerHight1}px;" class="card-body"></div>
			<div>
				<button class="btn btn-app bg-secondary">
					<span class="badge bg-success">300</span>
					<i class="fas fa-barcode"></i> Products
				</button>
				<button class="btn btn-app bg-success">
					<span class="badge bg-purple">891</span>
					<i class="fas fa-users"></i> Users
				</button>
				<button class="btn btn-app bg-danger">
					<span class="badge bg-teal">67</span>
					<i class="fas fa-inbox"></i> Orders
				</button>
				<button class="btn btn-app bg-warning">
					<span class="badge bg-info">12</span>
					<i class="fas fa-envelope"></i> Inbox
				</button>
				<button class="btn btn-app bg-info">
					<span class="badge bg-danger">531</span>
					<i class="fas fa-heart"></i> Likes
				</button>
			</div>
		</div>
	</div>
	<div class="col-6">
		<div class="card card-outline card-info">
			<div style="height: {$inerHight};" class="card-body">
				<input type="text" class="form-control" />
				<table>
					<tbody>
						<tr>
							<th></th>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
