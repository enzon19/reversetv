<script>
	import { getUserFullHistoryIDs } from '$lib/utils/getUserHistory';
	import { getPersonCredits, getMovieCredits, getShowCredits } from '$lib/utils/getTMDBData';
	import { Progress } from '$lib/elements/ui/progress/index.ts';
	import { Button } from '$lib/elements/ui/button';

	/** @type {{data: any}} */
	let { data } = $props();
	let { user, type, id, acc, item, traktURL } = data;

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

<div class="flex flex-col gap-2 sm:container">
	<div class="flex flex-col items-center justify-between gap-1.5 md:flex-row">
		<h1 class="text-center text-3xl font-black sm:text-left">{item.title} ({item.year})</h1>
		<Button href={'https://trakt.tv/' + traktURL} target="_blank" class="w-max"
			>Open in Trakt</Button
		>
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
		
	{/await}
</div>
