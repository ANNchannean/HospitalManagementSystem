<script lang=ts>
     export let 
</script>

<style>

</style>

<div class="col-3">
    <div class="form-group pb-3">
        <label for="price">Price</label>
        <input
            value={find_product?.price ?? ''}
            name="price"
            type="text"
            class="form-control"
            id="price"
        />
        {#if form?.price}
            <p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
        {/if}
    </div>
</div>
<div class="col-3">
    <div class="form-group pb-3">
        <label for="qty">Qty </label>
        <div class="input-group">
            <input
                class="form-control"
                value={inventory?.qty ?? ''}
                name="qty"
                type="number"
                id="qty"
            />
        </div>
    </div>
</div>
<div class="col-3">
    <div class="form-group pb-3">
        <label for="unit_id">Unit </label>
        <div class="input-group">
            <Select
                value={data.get_products.find((e) => e.id === product_id)?.unit_id}
                name="unit_id"
                items={units.map((e) => ({ id: e.id, name: e.unit }))}
            />

            {#if form?.product_id}
                <p class="text-danger p-0 m-0">{$t('common.input_data')}</p>
            {/if}
        </div>
    </div>
</div>