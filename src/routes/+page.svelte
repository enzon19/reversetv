<script lang="ts">
	import { PUBLIC_HOSTNAME } from '$env/static/public';
	import * as Alert from '$lib/elements/ui/alert/index';
	import Poster from '$lib/components/Poster.svelte';
	import Bulb from 'svelte-ionicons/Bulb.svelte';
	import lodash from 'lodash';

	let { data } = $props();
	let { user, history } = data;
</script>

{#if user}
	<Alert.Root class="mx-auto mb-2 max-w-max bg-yellow-600/15">
		<Bulb class="outline-hidden" size="1rem" />
		<Alert.Title class="font-semibold">Tip</Alert.Title>
		<Alert.Description
			>You can change any <strong>trakt.tv</strong> url to
			<strong>{PUBLIC_HOSTNAME.replace(/http\:\/\/|https\:\/\//, '')}</strong>
			to know about the connections of that movie or show and your history.<br /><strong
				>For example</strong
			>:
			<code>trakt.tv/movies/the-matrix-1999</code> =>
			<code>{PUBLIC_HOSTNAME.replace(/http\:\/\/|https\:\/\//, '')}/movies/the-matrix-1999</code>
		</Alert.Description>
	</Alert.Root>
	<div class="flex flex-col gap-2">
		<h2 class="text-center text-2xl font-semibold sm:text-left">Last Watched</h2>
		<div class="mt-2 grid grid-cols-[repeat(auto-fill,_minmax(170px,_1fr))] gap-3">
			{#each history
				.sort((a, b) => new Date(a.last_watched_at) - new Date(b.last_watched_at))
				.reverse()
				.slice(0, 8) as item}
				{@const itemType = item.show ? 'shows' : 'movies'}
				<Poster
					title={item.show?.title || item.movie?.title}
					id={item.show?.ids?.tmdb || item.movie?.ids?.tmdb}
					href={`/${itemType}/` + (item.show?.ids?.slug || item.movie?.ids?.slug)}
					date={item?.last_watched_at}
					type={itemType}
				/>
			{/each}
		</div>
	</div>
	<div class="flex flex-col gap-2">
		<div class="flex flex-col gap-1">
			<h2 class="text-center text-2xl font-semibold sm:text-left">Random Items Watched</h2>
			<span
				class="sm:mx-right mx-auto block w-full text-center text-sm font-normal sm:inline sm:text-left"
				>powered by <a href="https://randomtv.enzon19.com" class="underline" target="_blank"
					>RandomTV for Trakt</a
				></span
			>
		</div>
		<div class="mt-2 grid grid-cols-[repeat(auto-fill,_minmax(170px,_1fr))] gap-3">
			{#each lodash.shuffle(history).slice(0, 8) as item}
				{@const itemType = item.show ? 'shows' : 'movies'}
				<Poster
					title={item.show?.title || item.movie?.title}
					id={item.show?.ids.tmdb || item.movie?.ids.tmdb}
					href={`/${itemType}/` + (item.show?.ids.slug || item.movie?.ids.slug)}
					date={item?.last_watched_at}
					type={itemType}
				/>
			{/each}
		</div>
	</div>
{:else}
	<h2 class="container mx-auto mt-2 text-center text-2xl">To start, please continue with Trakt.</h2>
	<div class="mx-auto mt-2 text-center text-neutral-800 lg:w-[50%] dark:text-neutral-400">
		Connect with Trakt to analyze common actors across your watched movies and TV shows,
		highlighting connections between the productions.
	</div>
	<!-- update: Divulgação material -->
{/if}
