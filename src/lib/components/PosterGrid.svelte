<script lang="ts">
	import { onMount } from 'svelte';
	import Poster from '$lib/components/Poster.svelte';
	import type { TraktMovie, TraktShow } from '$lib/utils/getUserHistory';

	let { data, limit }: { data: (TraktMovie | TraktShow)[]; limit?: number | 'dynamic' } = $props();
	let container: HTMLDivElement;
	let visibleData: any[] = $state([]);

	if (limit === 'dynamic') {
		visibleData = data.slice(0, 8);
	} else {
		visibleData = limit ? data.slice(0, limit) : data;
	}

	function updateVisibleData() {
		if (!container) return;

		const screenWidth = window.innerWidth;

		// Mobile (< 535px)
		if (screenWidth < 535) {
			visibleData = data.slice(0, 8);
			return;
		}

		const containerWidth = container.clientWidth;
		const itemWidth = container.querySelector('div')?.clientWidth || 170;
		const itemsPerRow = Math.floor(containerWidth / itemWidth);

		if (itemsPerRow <= 0) {
			visibleData = [];
			return;
		}

		// Tablet/small desktop (< 1280px): full rows only
		if (screenWidth < 1280) {
			const fullRows = 2;
			const totalItems = itemsPerRow * fullRows;
			visibleData = data.slice(0, totalItems);
			return;
		}

		// Desktop (>= 1280px): show only one full row
		visibleData = data.slice(0, itemsPerRow);
	}

	onMount(() => {
		if (limit === 'dynamic') {
			updateVisibleData();
			window.addEventListener('resize', updateVisibleData);
			return () => window.removeEventListener('resize', updateVisibleData);
		}
	});
</script>

<div
	bind:this={container}
	class="mt-2 grid grid-cols-[repeat(auto-fill,_minmax(170px,_1fr))] gap-0 gap-y-3 sm:gap-3"
>
	{#each visibleData as item}
		{@const itemType = item.show ? 'show' : 'movie'}
		<div class="flex-1 basis-1/3">
			<Poster
				title={item.show?.title || item.movie?.title}
				id={item.show?.ids?.tmdb || item.movie?.ids?.tmdb}
				href={`/${itemType}s/` + (item.show?.ids?.slug || item.movie?.ids?.slug)}
				date={item?.last_watched_at}
				type={itemType}
			/>
		</div>
	{:else}
		<span>Nothing here.</span>
	{/each}
</div>
