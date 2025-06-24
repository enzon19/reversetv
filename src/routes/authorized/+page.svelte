<script lang="ts">
	let {
		data
	}: {
		data: {
			error: string;
		};
	} = $props();
</script>

<h2 class="container mt-2 text-center text-2xl font-semibold">Ops.</h2>
<p class="container text-center text-sm font-semibold text-neutral-500">{data.error}</p>
