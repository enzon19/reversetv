<script lang="ts">
	import Poster from '$lib/components/Poster.svelte';

	let { data } = $props();
	let query = $derived(data.query || '');
	let results = $derived(data.searchResults);
</script>

<svelte:head>
	<title>Results for "{query.length < 10 ? query : query.slice(0, 10) + '...'}" - ReverseTV</title>
</svelte:head>

<div class="sm:container">
	<h1 class="mb-2 text-center text-3xl font-black sm:text-left">Results for "{query}"</h1>
	<div class="mt-2 grid grid-cols-[repeat(auto-fill,_minmax(170px,_1fr))] gap-0 gap-y-3 sm:gap-3">
		{#each results as item}
			<Poster
				title={item?.[item.type]?.title || ''}
				id={item?.[item.type]?.ids?.tmdb || 0}
				type={item.type}
				href={`/${item.type}s/` + item?.[item.type]?.ids?.slug}
			/>
		{/each}
	</div>
</div>
