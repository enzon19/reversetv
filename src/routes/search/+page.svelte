<script>
	import Poster from '$lib/components/Poster.svelte';
	/** @type {{data: any}} */
	let { data } = $props();
	let query = $derived(data.query);
	let results = $derived(data.searchResults);
	// $: console.log(results)
</script>

<svelte:head>
	<title>Results for "{query.length < 10 ? query : query.slice(0, 10) + '...'}" - ReverseTV</title>
</svelte:head>

<div class="sm:container">
	<h1 class="mb-2 text-center text-3xl font-black sm:text-left">Results for "{query}"</h1>
	<div
		class="mt-2 grid gap-3"
		style="grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));"
	>
		{#each results as item}
			<Poster
				title={item[item.type].title}
				id={item[item.type].ids.tmdb}
				href={`/${item.type}s/` + item[item.type].ids.slug}
				type={item.type + 's'}
			/>
		{/each}
	</div>
</div>
