<script lang="ts">
	import '../app.css';

	import { PUBLIC_TRAKT_ID, PUBLIC_HOSTNAME } from '$env/static/public';
	import type { Snippet } from 'svelte';

	import { Button } from '$lib/elements/ui/button';
	import * as Avatar from '$lib/elements/ui/avatar';
	import * as Popover from '$lib/elements/ui/popover';
	import { Input } from '$lib/elements/ui/input';

	import Search from 'svelte-ionicons/Search.svelte';

	import { goto } from '$app/navigation';

	let { data, children } = $props();
	let { user } = data;

	let open: boolean = $state(false);
	async function signOut() {
		try {
			const request = await fetch('/out/sign');
			if (request.status !== 200) throw 'error';
			open = false;
			window.location.href = '/out';
		} catch (e) {
			console.error(e);
		}
	}

	let searchQuery = $state('');
	async function search(event: SubmitEvent) {
		event.preventDefault();
		goto('/search?q=' + encodeURIComponent(searchQuery));
	}
</script>

<header class="z-40 grid w-full grid-cols-[1fr_auto_1fr] gap-2 p-2">
	<form class="relative flex justify-start md:grow-0" onsubmit={search}>
		<Search class="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
		<Input
			type="search"
			placeholder="Search..."
			bind:value={searchQuery}
			class="w-full max-w-48 rounded-lg bg-neutral-300 pl-8 sm:max-w-64 lg:max-w-80 dark:bg-neutral-600"
		/>
	</form>

	<a href="/" class="justify-self-center">
		<img src="/logo.png" class="h-14" alt="ReverseTV" />
	</a>

	<div class="justify-self-end">
		{#if user}
			<Popover.Root bind:open>
				<Popover.Trigger class="inline-flex cursor-pointer items-center gap-2">
					<span class="max-w-[100px] truncate">{user.username}</span>
					<Avatar.Root>
						<Avatar.Image alt={user.username} src={user.images.avatar.full} />
						<Avatar.Fallback>{user.username.toUpperCase()[0]}</Avatar.Fallback>
					</Avatar.Root>
				</Popover.Trigger>
				<Popover.Content class="mt-1">
					<Button variant="destructive" class="w-full" onclick={signOut}>Sign out</Button>
				</Popover.Content>
			</Popover.Root>
		{:else}
			<a
				href="https://trakt.tv/oauth/authorize?client_id={PUBLIC_TRAKT_ID}&redirect_uri={PUBLIC_HOSTNAME}/authorized&response_type=code"
				class="inline-block"
			>
				<Button class="whitespace-nowrap">Continue with Trakt</Button>
			</a>
		{/if}
	</div>
</header>

<div class="container mx-auto flex grow flex-col gap-6 p-2">{@render children?.()}</div>

<footer class="z-30 mt-2 bg-neutral-400 p-2 text-center text-sm dark:bg-neutral-700">
	<span
		>Made by <a href="https://enzon19.com" class="underline" target="_blank">enzon19</a>. Make a
		donation
		<a class="underline" href="https://enzon19.com/donate" target="_blank">here</a>.</span
	>
</footer>

<style lang="postcss">
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
</style>
