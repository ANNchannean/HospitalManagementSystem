<script lang="ts">
	import Athtml from '$lib/components/etc/Athtml.svelte';
	import type { PageServerData } from './$types';

	export let data: PageServerData;
	$: ({ get_form_document } = data);
</script>

<div class="col-12">
	<div class="row justify-content-center">
		<div style="width: 1200px;">
			<table class="super-table">
				<tbody>
					<tr>
						<td>
							<div class="row">
								<Athtml html={get_form_document?.content ?? ''} />
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>

<style>
	@page {
		size: A4;
		margin-bottom: 1mm;
		margin-left: 5mm;
		margin-top: 5mm;
		margin-right: 5mm;
	}
</style>
