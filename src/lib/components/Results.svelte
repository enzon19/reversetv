<script lang="ts">
	import { getUserFullHistoryIDs } from '$lib/utils/getUserHistory';
	import {
		getPersonCredits,
		getMovieCredits,
		getShowCredits,
		getSeasonCredits
	} from '$lib/utils/getTMDBData';
	import { Progress } from '$lib/elements/ui/progress/index';
	import PeopleGrid from './PeopleGrid.svelte';

	let {
		user,
		item,
		type,
		itemNumber,
		acc
	}: { user?: TraktUser; item: any; type: Items; itemNumber?: number; acc?: string } = $props();

	let progress: number = $state(0);
	let progressMax: number = $state(1);

	async function reverseTVMain() {
		const id = item.ids.tmdb;
		let result = [];

		const creditsFunctions = {
			movies: getMovieCredits,
			shows: getShowCredits,
			seasons: getSeasonCredits
		};
		const credits = await creditsFunctions[type](id, itemNumber);

		progressMax = credits.length + 2;
		progress += 1;

		const history = await getUserFullHistoryIDs(user.username, acc);
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
				throw e;
			}
		}

		// console.log(result)
		return result;
		// (await getPersonCredits(credits[0].id)).filter(({id}) => history.includes(id))
	}
</script>

{#await reverseTVMain()}
	<div class="mx-auto w-[50%]">
		<span>{Math.ceil((progress / progressMax) * 100)}%</span>
		{#if progressMax - 2 > 45}
			<span class="text-neutral-500">There are {progressMax - 2} actors to check. Wait tight!</span>
		{/if}
		<Progress value={progress} max={progressMax} class="w-full" />
	</div>
{:then data}
	<PeopleGrid {data} />
{/await}
