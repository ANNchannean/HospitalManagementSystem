<script lang="ts">
	import Athtml from '$lib/coms/Athtml.svelte';
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
							<div id="print" class="row">
								<Athtml html={get_form_document?.content ?? ''} />
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>
