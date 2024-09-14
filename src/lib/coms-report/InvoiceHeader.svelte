<script lang="ts">
	import DateTimeFormat from '$lib/coms/DateTimeFormat.svelte';
	import type { PageServerData } from '../../routes/(report)/report/[id]/billing/$types';
	type Data = Pick<PageServerData, 'get_billing'>;
	export let data: Data;
	$: ({ get_billing } = data);
</script>

<div class="row invoice-info">
	<div class="col-4 invoice-col text-start">
		<span>អតិថិជន : </span>
		{#if get_billing?.pos_id}
			<span>{get_billing?.pos?.patient?.name_khmer}</span>
			<span>{get_billing?.pos?.patient?.name_latin}</span>
		{:else if get_billing?.visit_id}
			<span>{get_billing?.visit?.patient?.name_khmer}</span>
			<span>{get_billing?.visit?.patient?.name_latin}</span>
		{/if}
		<br />
		<span>ភេទ </span>
		<br />
		<span>អាយុ </span>
		<br />
		<span>អាសយដ្ឋាន </span>
	</div>
	<div class="col-4 invoice-col text-center">
		<b class="fs-3">វិក្កយបត្រ</b><br />
		<b class="fs-5">Invoice</b>
	</div>
	<div class="col-4 invoice-col text-end">
		<span>លេខរៀងវិក្កយបត្រ #000{get_billing?.id} </span> <br />
		<span>កាលបរិច្ឆេទ <DateTimeFormat date={get_billing?.created_at} /> </span>
	</div>
</div>
