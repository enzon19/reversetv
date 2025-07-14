<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { getUserFullHistoryIDs } from '$lib/utils/getUserHistory';
	import {
		getPersonCredits,
		getMovieCredits,
		getShowCredits,
		getSeasonCredits,
		getEpisodeCredits,
		type TMDBMovieCastMember,
		type TMDBShowCastMember,
		type TMDBPersonCastMember
	} from '$lib/utils/getTMDBData';
	import { Progress } from '$lib/elements/ui/progress/index';
	import { Button } from '$lib/elements/ui/button';
	import * as Alert from '$lib/elements/ui/alert/index';
	import Heart from '~icons/ion/heart';
	import PeopleGrid from './PeopleGrid.svelte';

	let {
		user,
		item,
		type,
		itemNumber,
		acc
	}: {
		user?: TraktUser;
		item: any;
		type: Items;
		itemNumber?: number | number[];
		acc?: string;
	} = $props();

	let progress: number = $state(0);
	let progressMax: number = $state(1);
	let data:
		| {
				person: TMDBMovieCastMember | TMDBShowCastMember;
				items: TMDBPersonCastMember[];
		  }[]
		| undefined = $state();
	let error: string | null = $state(null);
	let loading = $state(true);

	let abortController: AbortController | null = null;

	async function reverseTVMain() {
		try {
			error = null;
			loading = true;
			progress = 0;
			progressMax = 1;

			abortController = new AbortController();
			const signal = abortController.signal;

			const id = item.ids?.tmdb;
			if (!id) {
				throw new Error('TMDB ID not found');
			}

			let result = [];

			if (signal.aborted) return;

			let credits;
			switch (type) {
				case 'movies':
					credits = await getMovieCredits(id);
					break;
				case 'shows':
					credits = await getShowCredits(id);
					break;
				case 'seasons':
					if (typeof itemNumber !== 'number') {
						throw new Error('Expected itemNumber to be a number for seasons');
					}
					credits = await getSeasonCredits(id, itemNumber);
					break;
				case 'episodes':
					if (
						!Array.isArray(itemNumber) ||
						itemNumber.length !== 2 ||
						!itemNumber.every((n) => typeof n === 'number')
					) {
						throw new Error('Expected itemNumber to be [seasonNumber, episodeNumber] for episodes');
					}
					credits = await getEpisodeCredits(id, itemNumber);
					break;
				default:
					throw new Error('Invalid type');
			}

			if (signal.aborted) return;

			progressMax = credits.length + 2;
			progress = 1;

			const history = await getUserFullHistoryIDs(user?.username || 'username', acc || 'acc');

			if (signal.aborted) return;
			progress = 2;

			for (const person of credits) {
				if (signal.aborted) return;

				try {
					const personCredits = await getPersonCredits(person.id);
					if (signal.aborted) return;

					const crossovers = personCredits.filter(
						({ id: itemID }: { id: string }) =>
							itemID !== (type === 'movies' ? 'm_' + id : 't_' + id) && history.includes(itemID)
					);

					if (crossovers.length > 0) {
						result.push({ person, items: crossovers });
					}

					progress += 1;
				} catch (e) {
					console.error(`Error processing actor ${person.id}:`, e);
				}
			}

			if (!signal.aborted) {
				data = result;
				loading = false;
			}
		} catch (e) {
			if (!abortController?.signal.aborted) {
				console.error('Error in ReverseTV Main:', e);
				error = e instanceof Error ? e.message : 'Unknown error';
				loading = false;
			}
		}
	}

	function cancelOperation() {
		if (abortController) {
			abortController.abort();
		}
	}

	onMount(() => {
		reverseTVMain();
	});

	onDestroy(() => {
		cancelOperation();
	});
</script>

{#if error}
	<div class="mx-auto w-[50%] text-center">
		<div class="mb-4 text-red-500">
			Error: {error}
		</div>
		<button
			onclick={() => reverseTVMain()}
			class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
		>
			Try again
		</button>
	</div>
{:else if loading}
	<div class="mx-auto w-[50%]">
		<div class="mb-2 flex items-center justify-between">
			<span class="font-medium">{Math.ceil((progress / progressMax) * 100)}%</span>
		</div>

		{#if progressMax - 2 > 50}
			<p class="mb-2 text-sm text-neutral-500">
				There are {progressMax - 2} actors to check. Wait tight!
			</p>
		{/if}

		<Progress value={progress} max={progressMax} class="w-full" />

		<div class="mt-1 text-xs text-neutral-400">
			{progress} of {progressMax} steps completed
		</div>

		<Alert.Root class="mx-auto mt-4 w-full bg-red-600/15">
			<Heart class="size-4 outline-hidden" />
			<div class="flex flex-row items-center justify-between">
				<div>
					<Alert.Title class="font-semibold">Please, donate!</Alert.Title>
					<Alert.Description>While you wait, how about making a donation?</Alert.Description>
				</div>
				<Button href="https://enzon19.com/donate" target="_blank">Donate</Button>
			</div>
		</Alert.Root>
	</div>
{:else if data}
	<PeopleGrid {data} />
{/if}
