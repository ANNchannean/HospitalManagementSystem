<script lang="ts">
	import type { PageServerData } from '../../routes/(dash)/billing/sale-reprot/$types';
	import ClinichInfo from './ClinichInfo.svelte';
	import InvoiceBody from './InvoiceBody.svelte';
	import InvoiceHeader from './InvoiceHeader.svelte';
	type Data = Pick<PageServerData, 'get_clinic_info'>;
	export let data: Data;
	$: ({ get_clinic_info } = data);
</script>

<!-- Button trigger modal -->
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
	<slot />
</button>

<!-- Modal -->
<div
	class="modal fade modal-xl"
	id="exampleModal"
	tabindex="-1"
	aria-labelledby="exampleModalLabel"
	aria-hidden="true"
>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-body">
				<div class="row">
					<ClinichInfo data={{ get_clinic_info }} />
				</div>
				<hr />
				<InvoiceHeader />
				<InvoiceBody />
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
				<button type="button" class="btn btn-primary">Save changes</button>
			</div>
		</div>
	</div>
</div>

<style>
</style>
