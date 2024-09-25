<script lang="ts">
	let className = 'btn btn-primary btn-sm';
	export { className as class };
	export let id: string | number;
	function print() {
		window.print();
		document.getElementById('close-modal')?.click();
	}
</script>

<!-- Button trigger modal -->
<button
	on:click
	type="button"
	class={className}
	data-bs-toggle="modal"
	data-bs-target={`#id${id.toString()}`}
>
	<i class="fa-solid fa-print"></i>
</button>

<!-- Modal -->
<div
	class="modal"
	id={`id${id.toString()}`}
	data-bs-backdrop="static"
	data-bs-keyboard="false"
	tabindex="-1"
	aria-labelledby="staticBackdropLabel"
	aria-hidden="true"
>
	<div class="modal-dialog modal-fullscreen">
		<div class="modal-content">
			<div class="modal-body">
				<slot />
			</div>
			<div class="modal-footer d-print-none">
				<button id="close-modal" type="button" class="btn btn-secondary" data-bs-dismiss="modal"
					>Close</button
				>
				<button on:click={print} type="button" class="btn btn-primary">Print</button>
			</div>
		</div>
	</div>
</div>
