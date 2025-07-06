<script>
	import { Button } from '$lib/elements/ui/button';
	let { item, type, children } = $props();
</script>

<svelte:head>
	<title>{item.title} - ReverseTV</title>
</svelte:head>

<div class="flex flex-col gap-2 sm:container">
	<div class="flex flex-col items-center justify-between gap-1.5 md:flex-row">
		<h1 class="text-center text-3xl font-black sm:text-left">{item.title} ({item.year})</h1>
		<Button href="https://trakt.tv/{type}/{item.ids.slug}" target="_blank" class="w-max"
			>Open in Trakt</Button
		>
	</div>
	{@render children?.()}
</div>
