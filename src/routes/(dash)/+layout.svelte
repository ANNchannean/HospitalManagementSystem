<script lang="ts">
	import type { LayoutServerData } from './$types';
	export let data: LayoutServerData;
	import { page, navigating } from '$app/stores';
	import { _, locale } from '$lib/translations';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import { inerHight, globalLoading } from '$lib/store';
	import ViewRoom from '$lib/coms-report/ViewRoom.svelte';
	import { invalidateAll } from '$app/navigation';
	// import LoginTracker from '$lib/coms/LoginTracker.svelte';
	// import { loginTracker } from '$lib/helper/loginTracker';
	$: ({ get_clinich_info, get_progress_note, get_currency } = data);
	$: {
		$locale = (data?.lang as 'en' | 'km') || 'en';
	}
	let date = Intl.DateTimeFormat('en-GB', {
		timeStyle: 'medium',
		dateStyle: 'short',
		hour12: true
	}).format(new Date());
	onMount(() => {
		$inerHight = (window.innerHeight - (window.innerHeight * 29) / 100).toString().concat('px');
		const interval = setInterval(() => {
			// invalidateAll();
			date = Intl.DateTimeFormat('en-GB', {
				timeStyle: 'medium',
				hour12: true,
				dateStyle: 'short'
			})
				.format(new Date())
				.split('/')
				.join('-')
				.split(',')
				.join(' ');
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});
	function toggleSidebar() {
		const value = localStorage.getItem('sb|sidebar-toggle');
		document.body.classList.toggle('sb-sidenav-toggled');
		localStorage.setItem('sb|sidebar-toggle', value === 'false' ? 'true' : 'false');
	}
</script>

<svelte:head>
	<meta name="description" content="Hospital Managerment System" />
</svelte:head>

<ViewRoom {data} />
<!-- <LoginTracker /> -->
<nav class="sb-topnav navbar navbar-expand navbar-dark bg-primary">
	<!-- Navbar Brand-->
	<a class="navbar-brand ps-3" href="/dashboard">Hospital Systeme </a>
	<!-- Sidebar Toggle-->
	<!-- Navbar Search-->
	<button
		on:click={toggleSidebar}
		class="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0"
		id="sidebarToggle"
		><i class="fas fa-bars"></i>
	</button>
	{#if $navigating || $globalLoading}
		<i class="fa-solid fa-spinner fa-spin text-light"></i>
	{/if}
	<div class="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0"></div>
	<ul class="navbar-nav ml-auto">
		<form use:enhance method="post">
			{#if $locale === 'km'}
				<li class="nav-item">
					<button formaction="/?/lang_en" class="nav-link btn btn-link">
						<img src="/english.ico" alt="none" />
					</button>
				</li>
			{/if}
			{#if $locale === 'en'}
				<li class="nav-item">
					<button formaction="/?/lang_km" class="nav-link btn btn-link">
						<img src="/khmer.ico" alt="none" />
					</button>
				</li>
			{/if}
		</form>

		<li class="nav-item">
			<button
				data-bs-toggle="modal"
				data-bs-target="#view_room"
				class="nav-link btn btn-link active"
				type="button"
			>
				<div class="position-relative">
					<i class="fa-solid fa-bed"> </i>
					<span
						class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
					>
						{get_progress_note.length ?? ''}
						<span class="visually-hidden">unread messages</span>
					</span>
				</div>
			</button>
		</li>

		<li class="nav-item dropdown">
			<button
				class="nav-link btn btn-link active dropdown-toggle"
				id="navbarDropdown"
				type="button"
				data-bs-toggle="dropdown"
				aria-expanded="false"><i class="fas fa-user fa-fw"></i></button
			>
			<ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
				<li><a class="dropdown-item" href="#!">Settings</a></li>
				<li><a class="dropdown-item" href="#!">Activity Log</a></li>
				<li><hr class="dropdown-divider" /></li>
				<li><a class="dropdown-item" href="#!">Logout</a></li>
			</ul>
		</li>

		<li class="nav-item">
			<a href="/setting" class="nav-link btn btn-link border btn-sm py-0 mt-2 active">
				{get_currency?.currency_symbol ?? ''}
			</a>
		</li>
		<div class="d-sm-none d-md-block d-none d-sm-block">
			<li class="nav-item">
				<button class="nav-link btn btn-link active" type="button">
					<i class="fa-regular fa-clock fa-spin"></i>
					{date}
				</button>
			</li>
		</div>
	</ul>
</nav>
<div id="layoutSidenav">
	<div class=" border-end" id="layoutSidenav_nav">
		<nav class="sb-sidenav accordion sb-sidenav-light" id="sidenavAccordion">
			<div class="sb-sidenav-menu">
				<div class="nav">
					<div class="sb-sidenav-menu-heading">
						{#if $locale === 'en'}
							{get_clinich_info?.title_eng}
						{:else}
							{get_clinich_info?.title_khm}
						{/if}
					</div>
					<a class:active={$page.url.pathname === '/dashboard'} href="/dashboard" class="nav-link">
						<div class="sb-nav-link-icon">
							<i class="fas fa-tachometer-alt"></i>
						</div>
						{$_('dashboard')}
					</a>
					<a
						class:active={$page.url.pathname === '/billing/pos'}
						href="/billing/pos"
						class="nav-link"
					>
						<div class="sb-nav-link-icon">
							<i class="fas fa-money-bill-1-wave"></i>
						</div>
						{$_('pos')}
					</a>
					<!-- Billing  -->

					<button
						class="nav-link btn btn-link collapsed"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#collapseLayouts"
						aria-expanded="false"
						aria-controls="collapseLayouts"
					>
						<div class="sb-nav-link-icon"><i class="fas fa-money-bills"></i></div>
						{$_('billing')}
						<div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
					</button>

					<div
						class="collapse"
						id="collapseLayouts"
						aria-labelledby="headingOne"
						data-bs-parent="#sidenavAccordion"
					>
						<nav class="sb-sidenav-menu-nested nav">
							<a
								class:active={$page.url.pathname === '/billing/opd'}
								href="/billing/opd"
								class="nav-link"
							>
								<i class=" fas fa-stethoscope"></i> &nbsp;
								{$_('billing_opd')}
							</a>
							<a
								class:active={$page.url.pathname === '/billing/ipd'}
								href="/billing/ipd"
								class="nav-link"
							>
								<i class=" fas fa-procedures"></i>&nbsp;
								{$_('billing_ipd')}
							</a>
							<a
								class:active={$page.url.pathname === '/billing/report'}
								href="/billing/report"
								class="nav-link"
							>
								<i class="fa-solid fa-sack-dollar"></i>&nbsp;
								{$_('sale_reprot')}
							</a>
						</nav>
					</div>
					<!-- End Billing  -->
					<a class:active={$page.url.pathname === '/product'} href="/product" class="nav-link">
						<div class="sb-nav-link-icon">
							<i class="fa-solid fa-briefcase-medical"></i>
						</div>
						{$_('products')}
					</a>
					<!-- patient  -->
					<button
						class="nav-link btn btn-link collapsed"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#collapsepatient"
						aria-expanded="false"
						aria-controls="collapseLayouts"
					>
						<div class="sb-nav-link-icon"><i class="fas fa-wheelchair"></i></div>
						{$_('patient')}
						<div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
					</button>

					<div
						class="collapse"
						id="collapsepatient"
						aria-labelledby="headingOne"
						data-bs-parent="#sidenavAccordion"
					>
						<nav class="sb-sidenav-menu-nested nav">
							<a
								class:active={$page.url.pathname === '/patient/all'}
								href="/patient/all"
								class="nav-link"
							>
								<i class="fas fa-restroom"></i> &nbsp;
								{$_('patients')}
							</a>
							<a
								class:active={$page.url.pathname === '/patient/opd'}
								href="/patient/opd"
								class="nav-link"
							>
								<i class=" fas fa-stethoscope"></i>&nbsp;
								{$_('patients_opd')}
							</a>
							<a
								class:active={$page.url.pathname === '/patient/ipd'}
								href="/patient/ipd"
								class="nav-link"
							>
								<i class=" fas fa-procedures"></i>&nbsp;
								{$_('patients_ipd')}
							</a>
						</nav>
					</div>
					<!-- End patient  -->
					<!-- Medicine  -->
					<button
						class="nav-link collapsed btn btn-link"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#collapsemedecine"
						aria-expanded="false"
						aria-controls="collapseLayouts"
					>
						<div class="sb-nav-link-icon"><i class="fas fa-pills"></i></div>
						{$_('medicine')}
						<div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
					</button>

					<div
						class="collapse"
						id="collapsemedecine"
						aria-labelledby="headingOne"
						data-bs-parent="#sidenavAccordion"
					>
						<nav class="sb-sidenav-menu-nested nav">
							<a
								class:active={$page.url.pathname === '/medicine/list'}
								href="/medicine/list"
								class="nav-link"
							>
								<i class="fas fa-tablets"></i> &nbsp;
								{$_('list_medicine')}
							</a>
							<a
								class:active={$page.url.pathname === '/medicine/type'}
								href="/medicine/type"
								class="nav-link"
							>
								<i class="fas fa-capsules"></i> &nbsp;
								{$_('medicine_type')}
							</a>
						</nav>
					</div>
					<!-- End medicine -->
					<a class:active={$page.url.pathname === '/imagerie'} href="/imagerie" class="nav-link">
						<div class="sb-nav-link-icon">
							<i class=" fas fa-image"></i>
						</div>
						{$_('imagerie')}
					</a>
					<a
						class:active={$page.url.pathname === '/laboratory'}
						href="/laboratory"
						class="nav-link"
					>
						<div class="sb-nav-link-icon">
							<i class="fas fa-flask nav-icon"></i>
						</div>
						{$_('laboratory')}
					</a>
					<a
						class:active={$page.url.pathname === '/prescription'}
						href="/prescription"
						class="nav-link"
					>
						<div class="sb-nav-link-icon">
							<i class="fas fa-prescription"></i>
						</div>
						{$_('prescription')}
					</a>
					<a class:active={$page.url.pathname === '/vaccine'} href="/vaccine" class="nav-link">
						<div class="sb-nav-link-icon">
							<i class="fas fa-syringe"></i>
						</div>
						{$_('vaccine')}
					</a>
					<a class:active={$page.url.pathname === '/document'} href="/document" class="nav-link">
						<div class="sb-nav-link-icon">
							<i class="fa-solid fa-file"></i>
						</div>
						{$_('documents')}
					</a>
					<a class:active={$page.url.pathname === '/staff'} href="/staff" class="nav-link">
						<div class="sb-nav-link-icon">
							<i class="fas fa-users"></i>
						</div>
						{$_('staff')}
					</a>
					<button
						class="nav-link btn btn-link collapsed"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#collapsesetup"
						aria-expanded="false"
						aria-controls="collapseLayouts"
					>
						<div class="sb-nav-link-icon"><i class="fas fa-tools"></i></div>
						{$_('settup')}
						<div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
					</button>

					<div
						class="collapse"
						id="collapsesetup"
						aria-labelledby="headingOne"
						data-bs-parent="#sidenavAccordion"
					>
						<nav class="sb-sidenav-menu-nested nav">
							<a
								class:active={$page.url.pathname === '/settup/lab-group'}
								href="/settup/lab-group"
								class="nav-link"
							>
								<i class="fas fa-vials"></i> &nbsp;
								{$_('lab_group')}
							</a>
							<a
								class:active={$page.url.pathname.includes('/settup/parameter/')}
								href="/settup/parameter/group"
								class="nav-link"
							>
								<i class="fas fa-vial"></i>&nbsp;
								{$_('parameter')}
							</a>
							<a
								class:active={$page.url.pathname === '/settup/img-list'}
								href="/settup/img-list"
								class="nav-link"
							>
								<i class="fa-regular fa-image"></i>&nbsp;
								{$_('imagerie_list')}
							</a>
							<a
								class:active={$page.url.pathname === '/settup/img-group'}
								href="/settup/img-group"
								class="nav-link"
							>
								<i class="fa-solid fa-images"></i>&nbsp;
								{$_('imagerie_group')}
							</a>
							<a
								class:active={$page.url.pathname === '/settup/img-template'}
								href="/settup/img-template"
								class="nav-link"
							>
								<i class="fas fa-sticky-note"></i>&nbsp;
								{$_('template_imagerie')}
							</a>
							<a
								class:active={$page.url.pathname === '/settup/vaccine-list'}
								href="/settup/vaccine-list"
								class="nav-link"
							>
								<i class="fas fa-viruses"></i>&nbsp;

								{$_('vaccine_list')}
							</a>

							<a
								class:active={$page.url.pathname === '/settup/past-history'}
								href="/settup/past-history"
								class="nav-link"
							>
								<i class="fas fa-spell-check"></i>&nbsp;
								{$_('past_history')}
							</a>
							<a
								class:active={$page.url.pathname === '/settup/physical-exam'}
								href="/settup/physical-exam"
								class="nav-link"
							>
								<i class="fas fa-book-open"></i>&nbsp;
								{$_('physical_exam')}
							</a>

							<a
								class:active={$page.url.pathname === '/settup/department'}
								href="/settup/department"
								class="nav-link"
							>
								<i class="fas fa-building"></i>&nbsp;
								{$_('department')}
							</a>

							<a
								class:active={$page.url.pathname === '/settup/ward'}
								href="/settup/ward"
								class="nav-link"
							>
								<i class="fa-solid fa-hotel"></i>&nbsp; Ward/Room
							</a>
							<a
								class:active={$page.url.pathname === '/settup/report'}
								href="/settup/report"
								class="nav-link"
							>
								<i class="fas fa-book"></i>&nbsp;
								{$_('report')}
							</a>
							<a
								class:active={$page.url.pathname === '/settup/diagnosis'}
								href="/settup/diagnosis"
								class="nav-link"
							>
								<i class="fa-solid fa-comment-medical"></i>&nbsp;
								{$_('diagnosis')}
							</a>
							<a
								class:active={$page.url.pathname === '/settup/unit'}
								href="/settup/unit"
								class="nav-link"
							>
								<i class="fa-solid fa-layer-group"></i>&nbsp;
								{$_('unit')}
							</a>
							<a
								class:active={$page.url.pathname === '/settup/clinic-info'}
								href="/settup/clinic-info"
								class="nav-link"
							>
								<i class=" fa-solid fa-circle-h"></i>&nbsp;Clinic-info
							</a>
						</nav>
					</div>
				</div>

				<!-- <div class="sb-sidenav-footer">
				<div class="small">Logged in as:</div>
				Start Bootstrap
			</div> -->
			</div>
		</nav>
	</div>
	<div id="layoutSidenav_content">
		<main style="height: 100%;" class="bg-light">
			<div class="container-fluid p-3">
				<slot />
			</div>
		</main>
		<!-- <footer class="py-4 bg-light mt-auto">
				<div class="container-fluid px-4">
					<div class="d-flex align-items-center justify-content-between small">
						<div class="text-muted">Copyright &copy; Your Website 2023</div>
						<div>
							<a href={"#"}>Privacy Policy</a>
							&middot;
							<a href={"#"}>Terms &amp; Conditions</a>
						</div>
					</div>
				</div>
			</footer> -->
	</div>
</div>
