<script>
	import Results from '$lib/components/Results.svelte';
	import Details from '$lib/components/Details.svelte';

	import ArrowBackCircleOutline from '~icons/ion/arrow-back-circle-outline';

	let { data } = $props();
	let { user, item, seasonNumber, episodeNumber, acc } = data;
	const type = 'episodes';
</script>

<Details {item} {type}>
	<div class="flex flex-row items-center gap-3">
		<a class="size-min cursor-pointer" href="/shows/{item.ids.slug}"
			><ArrowBackCircleOutline class="size-8" /></a
		>
		<h2 class="text-xl font-semibold">Season {seasonNumber}, Episode {episodeNumber}</h2>
	</div>
	<Results {user} {type} {item} itemNumber={[seasonNumber, episodeNumber]} {acc} />
</Details>
