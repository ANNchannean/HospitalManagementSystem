<script lang="ts">
	import DateTimeFormat from '$lib/coms/DateTimeFormat.svelte';
	import { dobToAge } from '$lib/helper';
	import type { PageServerData } from '../../routes/(report)/report/[id]/billing/$types';
	type Data = Pick<PageServerData, 'get_billing'>;
	export let data: Data;
	$: ({ get_billing } = data);
</script>

<div style="font-size: 110%;" class="row invoice-info">
	<div class=" invoice-col text-center">
		<span class="fs-4 kh_font_muol_light ">វិក្កយបត្រ</span><br />
		<span class="fs-5 en_font_times_new_roman ">INVOICE</span>
	</div>
	<div class="">
		<table class="table table-sm table-responsive table-borderless border">
			<tbody>
				<tr>
					<td>អតិថិជន</td>
					<td> : </td>
					<td>
						{#if get_billing?.patient?.name_khmer}
							<span>{get_billing?.patient?.name_khmer ?? ''}</span>
						{/if}
						{#if get_billing?.patient?.name_latin}
							<span>{`( ${get_billing?.patient?.name_latin ?? ''} )`} </span>
						{/if}
						{#if !get_billing?.patient_id}
							<span>General</span>
						{/if}
					</td>
					<td>ភេទ​</td>
					<td> : </td>
					<td>
						<span>
							{get_billing?.patient?.gender === 'Male' ? 'ប្រុស' : 'ស្រី'}
						</span></td
					>
					<td>អាយុ</td>
					<td> : </td>
					<td>
						{dobToAge({ dob: get_billing?.patient?.dob ?? '', date: new Date().toISOString() }).y} ឆ្នាំ
					</td>
					<td class="text-end">
						<span>លេខរៀងវិក្កយបត្រ #000{get_billing?.id} </span>
					</td>
				</tr>
				<tr>
					<td>
						<span>អាសយដ្ឋាន</span>
					</td>
					<td> : </td>
					<td colspan="7">
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
					</td>
					<td colspan="2" class="text-end">
						<span>កាលបរិច្ឆេទ <DateTimeFormat date={get_billing?.created_at} /> </span>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>
