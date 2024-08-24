<script lang="ts">
	import { enhance } from '$app/forms';
	import Toast from '$lib/coms/Toast.svelte';
	import type { ActionData, PageServerData } from './$types';
	export let form: ActionData;
	export let data: PageServerData;
	$: ({ get_clinichinfo } = data);
	let loading = false;
</script>

{#if form?.message}
	<Toast message={form?.message} />
{/if}

<section class="p-3 p-md-4 p-xl-5">
	<div class="container">
		<div class="card border-light-subtle shadow-sm">
			<div class="row g-0">
				<div class="col-12 col-md-6 text-bg-primary">
					<div class="d-flex align-items-center justify-content-center h-100">
						<div class="col-10 col-xl-8 py-3 text-center justify-content-between">
							<img
								class="img-fluid rounded mb-4"
								loading="lazy"
								src="/files/{get_clinichinfo?.fileOrPicture[0]?.filename}"
								width="245"
								height="80"
								alt=""
							/>
							<hr class="border-primary-subtle mb-4" />
							<span class="  fs-2 mb-4 kh_font_muol">{get_clinichinfo?.title_khm}</span> <br />
							<span class="fs-3 mb-4">{get_clinichinfo?.title_eng}</span>
							<hr />
							<p class="lead text-start">
								{get_clinichinfo?.detail}
							</p>
						</div>
					</div>
				</div>
				<div class="col-12 col-md-6">
					<div class="card-body p-3 p-md-4 p-xl-5">
						<div class="row">
							<div class="col-12">
								<div class="mb-5">
									<h3>Log in</h3>
								</div>
							</div>
						</div>
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
							<div class="row gy-3 gy-md-4 overflow-hidden">
								<div class="col-12">
									<label for="email" class="form-label"
										>Username <span class="text-danger">*</span></label
									>
									<input
										type="text"
										class="form-control"
										name="username"
										id="username"
										placeholder="Username"
										required
									/>
								</div>
								<div class="col-12">
									<label for="password" class="form-label"
										>Password <span class="text-danger">*</span></label
									>
									<input
										type="password"
										class="form-control"
										name="password"
										id="password"
										value=""
										required
									/>
								</div>
								<div class="col-12">
									<div class="form-check">
										<input
											class="form-check-input"
											type="checkbox"
											value=""
											name="remember_me"
											id="remember_me"
										/>
										<label class="form-check-label text-secondary" for="remember_me">
											Keep me logged in
										</label>
									</div>
								</div>
								<div class="col-12">
									<div class="d-grid">
										<button disabled={loading} class="btn bsb-btn-xl btn-primary" type="submit"
											>Log in now</button
										>
									</div>
								</div>
							</div>
						</form>
						<div class="row">
							<div class="col-12">
								<hr class="mt-5 mb-4 border-secondary-subtle" />
								<div class="d-flex gap-2 gap-md-4 flex-column flex-md-row justify-content-md-end">
									<a href="#!" class="link-secondary text-decoration-none">Create new account</a>
									<a href="#!" class="link-secondary text-decoration-none">Forgot password</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
