<script lang="ts">
	import { dobToAge } from '$lib/helper';
	import type { LayoutServerData } from './$types';
	export let data: LayoutServerData;
	$: ({ get_clinic_info, get_visit } = data);
</script>

<svelte:head>
	<link href="/css/bootstrap-print.min.css" rel="stylesheet" />
</svelte:head>
<slot />
