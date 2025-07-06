<script>
	import Results from '$lib/components/Results.svelte';
	import Details from '$lib/components/Details.svelte';

	let { data } = $props();
	let { user, item, acc } = data;
	const type = 'movies';
</script>

<Details {item} {type}>
	<Results {user} {type} {item} {acc} />
</Details>
