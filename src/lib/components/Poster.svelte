<script>
	import { PUBLIC_TMDB_KEY } from '$env/static/public';
	import { Skeleton } from '$lib/elements/ui/skeleton';
	import { DateTime } from 'luxon';

	/** @type {{title: any, id: any, type: any, href: any, date: any, src: any}} */
	let { title, id, type, href, date, src = $bindable() } = $props();

	async function generateCover() {
		const headers = {
			accept: 'application/json',
			Authorization: 'Bearer ' + PUBLIC_TMDB_KEY
		};

		const imagesRequest = await fetch(
			`https://api.themoviedb.org/3/${type == 'shows' ? 'tv' : 'movie'}/${id}/images?language=en`,
			{
				method: 'GET',
				headers
			}
		);
		const imagesData = await imagesRequest.json();
		return (
			'https://image.tmdb.org/t/p/w200' + imagesData?.posters[0].file_path ||
			'https://pudim.com.br/pudim.jpg'
		);
	}

	if (!src) src = generateCover();
</script>

<a
	{href}
	class="flex flex-col items-center gap-2 {href
		? 'transition-all duration-300 hover:scale-105'
		: ''}"
>
	{#await src}
		<Skeleton class="h-64 w-full rounded-xl" />
	{:then src}
		<img {src} alt={title} class="h-64" />
	{/await}
	<div class="flex flex-col gap-0.5 text-center">
		<span class="w-40 truncate text-ellipsis text-neutral-800 dark:text-neutral-100" {title}
			>{title}</span
		>
		{#if date}
			<span class="text-xs text-neutral-600 dark:text-neutral-400"
				>{DateTime.fromISO(date).toLocaleString({ timeStyle: 'short', dateStyle: 'short' })}</span
			>
		{/if}
	</div>
</a>
