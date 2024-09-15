<script lang="ts">
	import DateTimeFormat from '$lib/coms/DateTimeFormat.svelte';
	import { dobToAge } from '$lib/helper';
	import type { PageServerData } from '../../routes/(report)/report/[id]/billing/$types';
	type Data = Pick<PageServerData, 'get_billing'>;
	export let data: Data;
	$: ({ get_billing } = data);
</script>

<div style="font-size: 110%;" class="row invoice-info">
	<div class="col-5 invoice-col text-start">
		<span>អតិថិជន : </span>
		{#if get_billing?.patient_id}
			<span>{get_billing?.patient?.name_khmer ?? ''}</span>
			<span>{get_billing?.patient?.name_latin ?? ''}</span>
		{:else}
			<span>General</span>
		{/if}
		<br />
		<span>ភេទ : </span>
		<span>
			{get_billing?.patient?.gender === 'Male' ? 'ប្រុស' : 'ស្រី'}
		</span>
		<br />
		<span>អាយុ : </span>
		<span>
			{dobToAge({ dob: get_billing?.patient?.dob ?? '', date: new Date().toISOString() }).y} ឆ្នាំ
		</span>
		<br />
		<span>អាសយដ្ឋាន : </span>
		<span>
			{get_billing?.patient?.village?.type ?? ''}
			{get_billing?.patient?.village?.name_khmer.concat(',') ?? ''}
			{get_billing?.patient?.commune?.type ?? ''}
			{get_billing?.patient?.commune?.name_khmer.concat(',') ?? ''}
			{get_billing?.patient?.district?.type ?? ''}
			{get_billing?.patient?.district?.name_khmer.concat(',') ?? ''}
			{get_billing?.patient?.provice?.type ?? ''}
			{get_billing?.patient?.provice?.name_khmer ?? ''}
		</span>
	</div>
	<div class="col-2 invoice-col text-center">
		<span class="fs-3 kh_font_muol_light">វិក្កយបត្រ</span><br />
		<span class="fs-3 en_font_times_new_roman">Invoice</span>
	</div>
	<div class="col-5 invoice-col text-end">
		<span>លេខរៀងវិក្កយបត្រ #000{get_billing?.id} </span> <br />
		<span>កាលបរិច្ឆេទ <DateTimeFormat date={get_billing?.created_at} /> </span>
	</div>
</div>
