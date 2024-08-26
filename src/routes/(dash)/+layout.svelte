<script lang="ts">
	import type { LayoutServerData } from './$types';
	export let data: LayoutServerData;
	import { page, navigating } from '$app/stores';
	import { t, locale } from '$lib/translations';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { inerHight, globalLoading } from '$lib/store';
	import ViewRoom from '$lib/coms/ViewRoom.svelte';
	$: ({ get_clinich_info, get_progress_note } = data);
	
	$: {
		$locale = data.lang ?? '';
	}
	let date = Intl.DateTimeFormat('en-GB', {
		timeStyle: 'medium',
		dateStyle: 'short',
		hour12: true
	}).format(new Date());
	onMount(() => {
		$inerHight = (window.innerHeight - (window.innerHeight * 21) / 100).toString().concat('px');
		const interval = setInterval(() => {
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
</script>

<svelte:head>
	<meta name="description" content="Hospital Managerment System" />
</svelte:head>

<ViewRoom {data} />

<nav class="sb-topnav navbar navbar-expand navbar-dark bg-primary">
	<!-- Navbar Brand-->
	<a class="navbar-brand ps-3" href="/dashboard">Hospital Systeme </a>
	<!-- Sidebar Toggle-->
	<!-- Navbar Search-->
	<button class="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle"
		><i class="fas fa-bars"></i>
	</button>
	{#if $navigating || $globalLoading}
		<i class="fa-solid fa-spinner fa-spin text-light"></i>
	{/if}
	<div class="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0"></div>
	<ul class="navbar-nav ml-auto">
		<form use:enhance method="post">
			{#if $locale === 'ko'}
				<li class="nav-item">
					<button formaction="/?/lang_en" class="nav-link btn btn-link">
						<img src="/english.ico" alt="none" />
					</button>
				</li>
			{/if}
			{#if $locale === 'en'}
				<li class="nav-item">
					<button formaction="/?/lang_ko" class="nav-link btn btn-link">
						<img src="/khmer.ico" alt="none" />
					</button>
				</li>
			{/if}
		</form>

		<li class="nav-item">
			<button
				on:click={() => {
					invalidateAll();
				}}
				data-bs-toggle="modal"
				data-bs-target="#view_room"
				class="nav-link btn btn-link"
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
				class="nav-link btn btn-link dropdown-toggle"
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

		<div class="d-sm-none d-md-block d-none d-sm-block">
			<li class="nav-item">
				<button class="nav-link btn btn-link" type="button">
					<span class=" badge p-2 badge-info">
						<i class="fa-regular fa-clock fa-spin"></i> {date}</span
					>
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
						{$t('common.dashboard')}
					</a>
					<a class:active={$page.url.pathname === '/pos'} href="/pos" class="nav-link">
						<div class="sb-nav-link-icon">
							<i class="fas fa-money-bill-1-wave"></i>
						</div>
						{$t('common.pos')}
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
						{$t('common.billing')}
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
								{$t('common.billing_opd')}
							</a>
							<a
								class:active={$page.url.pathname === '/billing/ipd'}
								href="/billing/ipd"
								class="nav-link"
							>
								<i class=" fas fa-procedures"></i>&nbsp;
								{$t('common.billing_ipd')}
							</a>
							<a
								class:active={$page.url.pathname === '/billing/sale-reprot'}
								href="/billing/sale-reprot"
								class="nav-link"
							>
								<i class="fa-solid fa-sack-dollar"></i>&nbsp;
								{$t('common.sale_reprot')}
							</a>
						</nav>
					</div>
					<!-- End Billing  -->
					<a class:active={$page.url.pathname === '/product'} href="/product" class="nav-link">
						<div class="sb-nav-link-icon">
							<i class="fa-solid fa-briefcase-medical"></i>
						</div>
						{$t('common.products')}
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
						{$t('common.patient')}
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
								{$t('common.patients')}
							</a>
							<a
								class:active={$page.url.pathname === '/patient/opd'}
								href="/patient/opd"
								class="nav-link"
							>
								<i class=" fas fa-stethoscope"></i>&nbsp;
								{$t('common.patients_opd')}
							</a>
							<a
								class:active={$page.url.pathname === '/patient/ipd'}
								href="/patient/ipd"
								class="nav-link"
							>
								<i class=" fas fa-procedures"></i>&nbsp;
								{$t('common.patients_ipd')}
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
						{$t('common.medicine')}
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
								{$t('common.list_medicine')}
							</a>
							<a
								class:active={$page.url.pathname === '/medicine/type'}
								href="/medicine/type"
								class="nav-link"
							>
								<i class="fas fa-capsules"></i> &nbsp;
								{$t('common.medicine_type')}
							</a>
						</nav>
					</div>
					<!-- End medicine -->
					<a class:active={$page.url.pathname === '/imagerie'} href="/imagerie" class="nav-link">
						<div class="sb-nav-link-icon">
							<i class=" fas fa-image"></i>
						</div>
						{$t('common.imagerie')}
					</a>
					<a
						class:active={$page.url.pathname === '/laboratory'}
						href="/laboratory"
						class="nav-link"
					>
						<div class="sb-nav-link-icon">
							<i class="fas fa-flask nav-icon"></i>
						</div>
						{$t('common.laboratory')}
					</a>
					<a
						class:active={$page.url.pathname === '/prescription'}
						href="/prescription"
						class="nav-link"
					>
						<div class="sb-nav-link-icon">
							<i class="fas fa-prescription"></i>
						</div>
						{$t('common.prescription')}
					</a>
					<a class:active={$page.url.pathname === '/vaccine'} href="/vaccine" class="nav-link">
						<div class="sb-nav-link-icon">
							<i class="fas fa-syringe"></i>
						</div>
						{$t('common.vaccine')}
					</a>
					<a class:active={$page.url.pathname === '/document'} href="/document" class="nav-link">
						<div class="sb-nav-link-icon">
							<i class="fa-solid fa-file"></i>
						</div>
						{$t('common.documents')}
					</a>
					<a class:active={$page.url.pathname === '/staff'} href="/staff" class="nav-link">
						<div class="sb-nav-link-icon">
							<i class="fas fa-users"></i>
						</div>
						{$t('common.staff')}
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
						{$t('common.settup')}
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
								{$t('common.lab_group')}
							</a>
							<a
								class:active={$page.url.pathname.includes('/settup/parameter/')}
								href="/settup/parameter/group"
								class="nav-link"
							>
								<i class="fas fa-vial"></i>&nbsp;
								{$t('common.parameter')}
							</a>
							<a
								class:active={$page.url.pathname === '/settup/img-list'}
								href="/settup/img-list"
								class="nav-link"
							>
								<i class="fa-regular fa-image"></i>&nbsp;
								{$t('common.imagerie_list')}
							</a>
							<a
								class:active={$page.url.pathname === '/settup/img-group'}
								href="/settup/img-group"
								class="nav-link"
							>
								<i class="fa-solid fa-images"></i>&nbsp;
								{$t('common.imagerie_group')}
							</a>
							<a
								class:active={$page.url.pathname === '/settup/img-template'}
								href="/settup/img-template"
								class="nav-link"
							>
								<i class="fas fa-sticky-note"></i>&nbsp;
								{$t('common.template_imagerie')}
							</a>
							<a
								class:active={$page.url.pathname === '/settup/vaccine-list'}
								href="/settup/vaccine-list"
								class="nav-link"
							>
								<i class="fas fa-viruses"></i>&nbsp;

								{$t('common.vaccine_list')}
							</a>

							<a
								class:active={$page.url.pathname === '/settup/past-history'}
								href="/settup/past-history"
								class="nav-link"
							>
								<i class="fas fa-spell-check"></i>&nbsp;
								{$t('common.past_history')}
							</a>
							<a
								class:active={$page.url.pathname === '/settup/physical-exam'}
								href="/settup/physical-exam"
								class="nav-link"
							>
								<i class="fas fa-book-open"></i>&nbsp;
								{$t('common.physical_exam')}
							</a>

							<a
								class:active={$page.url.pathname === '/settup/department'}
								href="/settup/department"
								class="nav-link"
							>
								<i class="fas fa-building"></i>&nbsp;
								{$t('common.department')}
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
								{$t('common.report')}
							</a>
							<a
								class:active={$page.url.pathname === '/settup/diagnosis'}
								href="/settup/diagnosis"
								class="nav-link"
							>
								<i class="fa-solid fa-comment-medical"></i>&nbsp;
								{$t('common.diagnosis')}
							</a>
							<a
								class:active={$page.url.pathname === '/settup/unit'}
								href="/settup/unit"
								class="nav-link"
							>
								<i class="fa-solid fa-layer-group"></i>&nbsp;
								{$t('common.unit')}
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
