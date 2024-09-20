<script lang="ts">
	import type { PageServerData } from '../../routes/(report)/report/[id]/billing/$types';
	type Data = Pick<PageServerData, 'get_clinic_info'>;
	export let data: Data;
	$: ({ get_clinic_info } = data);
</script>

<div class="row">
	<div class="col-auto text-center">
		<img
			id="imgp1"
			height="150px"
			class="float-right"
			src="/files/{get_clinic_info?.fileOrPicture[0]?.filename}"
			alt="no logo"
		/>
	</div>
	<div class="col text-center pt-1">
		<p style="font-size: 30px;color:#0000FF" class="kh_font_muol m-0">
			{get_clinic_info?.title_khm ?? ''}
		</p>
		<p style="font-size: 25px;color:#0000FF" class="en_font_times_new_roman m-0">
			{get_clinic_info?.title_eng ?? ''}
		</p>
		<p style="font-size: 20px;color:#0000FF" class="kh_font_battambang m-0">
			{get_clinic_info?.detail ?? ''}
		</p>
		<p style="font-size: 20px;color:#FF00FF" class="kh_font_battambang m-0">
			{get_clinic_info?.contact ?? ''}
		</p>
	</div>
	<div class="col-auto text-center">
		<img
			height="150px"
			class="float-right"
			src="/files/{get_clinic_info?.fileOrPicture[1]?.filename}"
			alt="no logo"
		/>
	</div>
</div>
