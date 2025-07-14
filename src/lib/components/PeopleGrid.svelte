<script lang="ts">
	import Poster from '$lib/components/Poster.svelte';
	import type {
		TMDBMovieCastMember,
		TMDBPersonCastMember,
		TMDBShowCastMember
	} from '$lib/utils/getTMDBData';

	let {
		data
	}: {
		data: {
			person: TMDBMovieCastMember | TMDBShowCastMember;
			items: TMDBPersonCastMember[];
		}[];
	} = $props();
</script>

<div class="flex flex-col gap-4">
	{#each data as { person, items }}
		<div class="flex flex-col gap-1 border-t border-neutral-500">
			<div class="mt-4 flex items-center justify-normal gap-2">
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
							>{'character' in person
								? person.character
								: person.roles?.map((e) => e.character).join(', ')}</span
						></span
					>
				</div>
			</div>
			<div
				class="mt-2 grid grid-cols-[repeat(auto-fill,_minmax(170px,_1fr))] gap-0 gap-y-3 sm:gap-3"
			>
				{#each items as item}
					<!-- href={`/${itemType}s/` + (item.show?.ids?.slug || item.movie?.ids?.slug)} -->
					{@const itemType = item.media_type === 'tv' ? 'show' : 'movie'}
					<div class="flex-1 basis-1/3">
						<Poster
							title={item.character}
							id={item.id}
							type={itemType}
							src={item?.poster_path
								? 'https://image.tmdb.org/t/p/w200' + item.poster_path
								: undefined}
						/>
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<span class="text-neutral-500"
			>Hmmm. No connections between this item and your history was found.</span
		>
	{/each}
</div>
