<script>
	import Results from '$lib/components/Results.svelte';
	import { Button } from '$lib/elements/ui/button';

	let { data } = $props();
	let { user, item, type, acc } = data;

	let page = $state('select');
</script>

<div class="flex flex-col gap-2 sm:container">
	<div class="flex flex-col items-center justify-between gap-1.5 md:flex-row">
		<h1 class="text-center text-3xl font-black sm:text-left">{item.title} ({item.year})</h1>
		<Button href="https://trakt.tv/{type}/{item.ids.slug}" target="_blank" class="w-max"
			>Open in Trakt</Button
		>
	</div>
	{#if type === 'shows' && page == 'select'}
		<div class="grid grid-flow-col gap-4">
			{#each item.seasons as season}
				<div class="bg-primary/30 flex flex-col rounded-lg p-4 text-center text-lg">
					{!season.number ? 'Specials' : 'Season ' + season.number}
					<span class="text-sm">{season.completed}/{season.aired} episodes</span>
				</div>
			{/each}
		</div>
		<Button class="mt-2" size="lg" onclick={() => (page = 'results')}
			>Analyze full show instead</Button
		>
		<!-- {:else if type === 'seasons'}
		<textarea name="" id="">{JSON.stringify(item, null, 2)}</textarea> -->
	{:else}
		{#if type !== 'movies'}
			<Button size="icon" onclick={() => (page = 'select')}>Back</Button>
		{/if}
		<Results {user} {type} {item} {acc} />
	{/if}
</div>
