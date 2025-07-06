<script>
	import Results from '$lib/components/Results.svelte';
	import Details from '$lib/components/Details.svelte';
	import { Button } from '$lib/elements/ui/button';

	import ArrowBackCircleOutline from '~icons/ion/arrow-back-circle-outline';

	let { data } = $props();
	let { user, item, acc } = data;

	const type = 'shows';
	let page = $state('select');
</script>

<Details {item} {type}
	>{#if page == 'select'}
		<div class="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-4">
			{#each item.seasons as season}
				<a
					href="/shows/{item.ids.slug}/seasons/{season.number}"
					class="{season.completed == season.aired
						? 'bg-primary/30'
						: 'dark:bg-background/30 bg-foreground/10'} flex flex-col rounded-lg p-4 text-center text-lg"
				>
					{!season.number ? 'Specials' : 'Season ' + season.number}
					<span class="text-sm">{season.completed}/{season.aired} episodes</span>
				</a>
			{/each}
		</div>
		<Button class="mt-2" size="lg" onclick={() => (page = 'results')}
			>Analyze full show instead</Button
		>
	{:else}
		<div class="flex flex-row items-center gap-3">
			<button class="size-min cursor-pointer" onclick={() => (page = 'select')}
				><ArrowBackCircleOutline class="size-8" /></button
			>
			<h2 class="text-xl font-semibold">Seasons</h2>
		</div>
		<Results {user} {type} {item} {acc} />
	{/if}
</Details>
