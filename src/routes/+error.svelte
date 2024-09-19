<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="page-not-found">
	<div class="bg-light">
		<h2>{$page.status}</h2>
		<h3 class="mt-2">Opps!</h3>
		<h3>{$page.error?.message}</h3>
		<div class="mt-5">
			<button on:click={() => history.back()} type="button" class="btn m-2 m-md-0 btn-primary"
				><i class="bi bi-house-door-fill" /> Back Home</button
			>
			<button type="button" class="btn m-2 m-md-0 btn-success"
				><i class="bi bi-person-lines-fill" /> Contact Us</button
			>
		</div>
	</div>
</div>

<style>
	.page-not-found h2 {
		font-size: 130px;
		color: #e91e63;
	}
	.page-not-found h3 {
		font-size: 42px;
	}
	.page-not-found .bg-light {
		width: 50%;
		padding: 50px;
		text-align: center;
		border-radius: 5px;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	@media (max-width: 767px) {
		.page-not-found h2 {
			font-size: 100px;
		}
		.page-not-found h3 {
			font-size: 28px;
		}
		.page-not-found .bg-light {
			width: 100%;
		}
	}
</style>
