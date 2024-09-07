<script lang="ts">
	import { enhance } from '$app/forms';
	export let action = '';
	export let version = '';
	export let username = '';
	export let ip_address = '';
	export let mac_address = '';
</script>

<form use:enhance {action} method="post">
	<input type="hidden" name="version" value={version} />
	<input type="hidden" name="username" value={username} />
	<input type="hidden" name="ip_address" value={ip_address} />
	<input type="hidden" name="mac_address" value={mac_address} />
</form>
