<script lang="ts">
	import type { PageServerData } from '../../routes/(dash)/settup/img-template/$types';
	import Renderhtml from '$lib/coms/Renderhtml.svelte';
	export let data: PageServerData;
	export let template_id: number;
	$: ({ get_templates } = data);
	$: find_template = get_templates.find((e) => e.id === template_id);
</script>

<div class="modal fade" id="template_view" data-bs-backdrop="static" data-bs-focus="false">
	<div class="modal-dialog modal-xl">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title">{find_template?.diagnosis ?? ''}</h4>
				<button
					id="close-template_view"
					type="button"
					class="btn-close"
					data-bs-dismiss="modal"
					aria-label="Close"
				>
				</button>
			</div>
			<div class="modal-body">
				<Renderhtml value={find_template?.template ?? ''} />
				<!-- <Athtml html={find_template?.template ?? ''} /> -->
			</div>
		</div>
	</div>
</div>
