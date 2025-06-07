<script>
	import { getUserFullHistoryIDs } from '$lib/utils/getUserHistory';
	import { getPersonCredits, getMovieCredits, getShowCredits } from '$lib/utils/getTMDBData';
	import { Progress } from '$lib/elements/ui/progress/index.ts';
	import { Button } from '$lib/elements/ui/button';
	import Poster from '$lib/components/Poster.svelte';

	/** @type {{data: any}} */
	let { data } = $props();
	let { user, type, id, acc, item } = data;

	let progress = $state(0);
	let progressMax = $state(1);
	let error;

	async function reverseTVMain() {
		let result = [];
		const credits = type === 'movies' ? await getMovieCredits(id) : await getShowCredits(id);
		progressMax = credits.length + 2;
		progress += 1;
		const history = await getUserFullHistoryIDs(user.user.username, acc);
		progress += 1;

		for (const person of credits) {
			try {
				const personCredits = await getPersonCredits(person.id);

				const crossovers = personCredits.filter(
					({ id: itemID }) =>
						itemID !== (type === 'movies' ? 'm_' + id : 't_' + id) && history.includes(itemID)
				);
				if (crossovers.length > 0) result.push({ person, items: crossovers });

				progress += 1;
			} catch (e) {
				console.error(e);
				error = e;
				return;
			}
		}

		// console.log(result)
		return result;
		// (await getPersonCredits(credits[0].id)).filter(({id}) => history.includes(id))
	}
</script>

<div class="sm:container">
	<div class="flex flex-row">
		<h1 class="mb-2 text-center text-3xl font-black sm:text-left">{item.title} ({item.year})</h1>
		<Button href={id}>Open in Trakt</Button>
	</div>
	{#await reverseTVMain()}
		<div class="mx-auto w-[50%]">
			<span>{parseInt((progress / progressMax) * 100)}%</span>
			{#if progressMax - 2 > 45}
				<span class="text-neutral-500"
					>There are {progressMax - 2} actors to check. Wait tight!</span
				>
			{/if}
			<Progress value={progress} max={progressMax} class="w-full" />
		</div>
	{:then peopleAndItems}
		<div class="flex flex-col gap-4">
			{#each peopleAndItems as { person, items }}
				<div class="flex flex-col gap-1 border-t border-neutral-500">
					<div class="mt-4 flex items-center justify-center gap-2 sm:justify-normal">
						<img
							src="https://image.tmdb.org/t/p/w200{person.profile_path}"
							alt={person.name}
							class="h-20 rounded-lg"
						/>
						<div>
							<h1 class="text-2xl font-semibold">
								{person.name} <span class="font-normal text-neutral-500">({items.length})</span>
							</h1>
							<span class="font-normal text-neutral-600 dark:text-neutral-300"
								>as <span class="font-medium"
									>{person.character || person.roles.map((e) => e.character).join(', ')}</span
								></span
							>
						</div>
					</div>
					<div
						class="mt-2 grid gap-3"
						style="grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));"
					>
						{#each items as item}
							<Poster
								title={item.character}
								src="https://image.tmdb.org/t/p/w200{item.poster_path}"
							/>
						{/each}
					</div>
				</div>
			{:else}
				<span class="text-neutral-500"
					>Hmmm. No connections between this item and your history was found.</span
				>
			{/each}
		</div>
	{/await}
</div>
