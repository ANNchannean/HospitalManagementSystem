<script lang="ts">
	import DateTimeFormat from '$lib/coms/DateTimeFormat.svelte';
	import type { PageServerData } from '../../routes/(report)/report/[id]/billing/$types';
	type Data = Pick<PageServerData, 'get_billing'>;
	export let data: Data;
	$: ({ get_billing } = data);
</script>

<div style="font-size: 110%;" class="row invoice-info">
	<div class="col-4 invoice-col text-start">
		<span>អតិថិជន : </span>
		{#if get_billing?.patient_id}
			<span>{get_billing?.patient?.name_khmer ?? ''}</span>
			<span>{get_billing?.patient?.name_latin ?? ''}</span>
		{:else}
			<span>General</span>
		{/if}
		<br />
		<span>ភេទ : </span>
		<br />
		<span>អាយុ : </span>
		<br />
		<span>អាសយដ្ឋាន : </span>
	</div>
	<div class="col-4 invoice-col text-center">
		<span  class="fs-3 kh_font_muol_light">វិក្កយបត្រ</span><br />
		<span class="fs-3 en_font_times_new_roman">Invoice</span>
	</div>
	<div class="col-4 invoice-col text-end">
		<span>លេខរៀងវិក្កយបត្រ #000{get_billing?.id} </span> <br />
		<span>កាលបរិច្ឆេទ <DateTimeFormat date={get_billing?.created_at} /> </span>
	</div>
</div>
