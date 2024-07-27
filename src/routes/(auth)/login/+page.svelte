<script lang="ts">
	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';
	import type { ActionData } from './$types';
	import { locale, t, locales } from '$lib/translations';
	import SubmitButton from '$lib/components/SubmitButton.svelte';
	export let form: ActionData;
	let loading = false;
</script>

<main class="hold-transition login-page">
	<div class="login-box">
		{#if form?.message}
			<div
				in:fade={{ duration: 300 }}
				out:fade={{ duration: 300 }}
				class="alert alert-warning alert-dismissible fade show"
				role="alert"
			>
				<strong>Hay!</strong>
				{form?.message}
			</div>
		{/if}
		<div class="card card-outline card-primary">
			<div class="card-header text-center">
				<a href={'#'} class="h1"><b>Admin</b></a>
			</div>
			<div class="card">
				<div class="card-body login-card-body">
					<p class="login-box-msg">Sign in to start your session</p>
					<form
						use:enhance={() => {
							loading = true;
							return async ({ update, result }) => {
								await update();
								loading = false;
								if (result.type !== 'failure') {
									window.location.reload();
								}
							};
						}}
						action="?/login"
						method="post"
					>
						<div class="input-group mb-3">
							<input name="username" type="text" class="form-control" placeholder="Username" />
							<div class="input-group-append">
								<div class="input-group-text">
									<span class="fas fa-user"></span>
								</div>
							</div>
						</div>
						<div class="input-group mb-3">
							<input name="password" type="password" class="form-control" placeholder="Password" />
							<div class="input-group-append">
								<div class="input-group-text">
									<span class="fas fa-lock"></span>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-8">
								<div class="icheck-primary">
									<input type="checkbox" id="remember" />
									<label for="remember"> Remember Me </label>
								</div>
							</div>

							<div class="col-12">
								<SubmitButton style="btn-block" text_only={true} {loading} name="Sign In" />
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</main>
