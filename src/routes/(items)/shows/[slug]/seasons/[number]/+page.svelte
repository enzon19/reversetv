<script>
	import Results from '$lib/components/Results.svelte';
	import Details from '$lib/components/Details.svelte';
	import { Button } from '$lib/elements/ui/button';
	import { DateTime } from 'luxon';

	import ArrowBackCircleOutline from '~icons/ion/arrow-back-circle-outline';

	let { data } = $props();
	let { user, item, seasonNumber, acc } = data;

	const type = 'seasons';
	let page = $state('select');
</script>

<Details {item} {type}>
	<div class="flex flex-row items-center gap-3">
		<a class="size-min cursor-pointer" href="/shows/{item.ids.slug}"
			><ArrowBackCircleOutline class="size-8" /></a
		>
		<h2 class="text-xl font-semibold">Season {seasonNumber}</h2>
	</div>
	{#if page == 'select'}
		<div class="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-4">
			{#each item.seasons[seasonNumber].episodes as episode}
				<a
					href="/shows/{item.ids.slug}/seasons/{seasonNumber}/episodes/{episode.number}"
					class="{episode.completed
						? 'bg-primary/30'
						: 'dark:bg-background/30 bg-foreground/10'} flex flex-col rounded-lg p-4 text-center text-lg"
				>
					{'Episode ' + episode.number}
					<span class="text-sm"
						>{episode.completed
							? DateTime.fromISO(episode.last_watched_at).toLocaleString({
									timeStyle: 'short',
									dateStyle: 'short'
								})
							: 'Not watched'}</span
					>
				</a>
			{/each}
		</div>
		<Button class="mt-2" size="lg" onclick={() => (page = 'results')}
			>Analyze full season instead</Button
		>
	{:else}
		<div class="flex flex-row items-center gap-3">
			<button class="size-min cursor-pointer" onclick={() => (page = 'select')}
				><ArrowBackCircleOutline class="size-8" /></button
			>
			<h2 class="text-xl font-semibold">Episodes</h2>
		</div>
		<Results {user} {type} {item} itemNumber={seasonNumber} {acc} />
	{/if}
</Details>
