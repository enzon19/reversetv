<script lang="ts">
	import Poster from '$lib/components/Poster.svelte';

	let {
		data
	}: {
		data: {
			person: {
				name: string;
				roles: string[];
			};
			items: string[];
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
					<Poster title={item.character} src="https://image.tmdb.org/t/p/w200{item.poster_path}" />
				{/each}
			</div>
		</div>
	{:else}
		<span class="text-neutral-500"
			>Hmmm. No connections between this item and your history was found.</span
		>
	{/each}
</div>
