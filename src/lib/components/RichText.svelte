<script lang="ts">
	import type { PageServerData } from '../../routes/(dash)/settup/img-template/$types';
	export let data: PageServerData;
	export let template_id: number;
	$: ({ get_templates } = data);
	$: find_template = get_templates.find((e) => e.id === template_id);
</script>

<div class="modal fade" id="template_view" data-bs-backdrop="static">
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
				<!-- <textarea
					value={find_template?.template ?? ''}
					name="template_view"
					id="template-view1"
					rows="10"
					class="form-control"
				/> -->
				{@html find_template?.template}
			</div>
		</div>
	</div>
</div>
