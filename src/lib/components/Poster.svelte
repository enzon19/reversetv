<script lang="ts">
	import { PUBLIC_TMDB_KEY } from '$env/static/public';
	import { Skeleton } from '$lib/elements/ui/skeleton';
	import { DateTime } from 'luxon';

	let {
		title,
		id,
		type,
		href,
		date,
		src = $bindable()
	}: {
		title: string;
		id: string | number;
		type: 'movie' | 'show';
		href?: string;
		date?: string;
		src?: string | Promise<string>;
	} = $props();

	async function generateCover() {
		const headers = {
			accept: 'application/json',
			Authorization: 'Bearer ' + PUBLIC_TMDB_KEY
		};

		const imagesRequest = await fetch(
			`https://api.themoviedb.org/3/${type == 'show' ? 'tv' : 'movie'}/${id}/images?language=en`,
			{
				method: 'GET',
				headers
			}
		);
		const imagesData = await imagesRequest.json();

		const imageURL = imagesData?.posters?.[0]?.file_path;
		return imageURL ? 'https://image.tmdb.org/t/p/w200' + imageURL : '/placeholder.png';
	}

	if (!src) src = generateCover();
</script>

<a
	{href}
	class="flex flex-col items-center gap-2 {href
		? 'transition-all duration-300 sm:hover:scale-105'
		: ''}"
>
	{#await src}
		<div class="aspect-[2/3] w-full">
			<Skeleton class="bg-primary/40 h-full w-full" />
		</div>
	{:then src}
		<img {src} alt={title} class="aspect-[2/3] w-full object-cover" />
	{/await}
	<div class="flex w-full flex-col gap-0.5 text-center">
		<span class="truncate px-2 font-medium text-ellipsis text-neutral-800 dark:text-neutral-100"
			>{title}</span
		>
		{#if date}
			<span class="text-xs text-neutral-600 dark:text-neutral-400">
				{DateTime.fromISO(date).toLocaleString({ timeStyle: 'short', dateStyle: 'short' })}
			</span>
		{/if}
	</div>
</a>
