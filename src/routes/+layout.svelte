<script>
  import { preventDefault } from 'svelte/legacy';

  import "../app.css";
  import { PUBLIC_TRAKT_ID } from "$env/static/public";
  import { Button } from "$lib/elements/ui/button";
  import * as Avatar from "$lib/elements/ui/avatar";
  import * as Popover from "$lib/elements/ui/popover";
  import { Input } from "$lib/elements/ui/input";
  import Search from "svelte-ionicons/Search.svelte";
  import { goto } from "$app/navigation";

  /** @type {{data: any, children?: import('svelte').Snippet}} */
  let { data, children } = $props();
  let { user } = data;

  async function signOut() {
    await fetch("/out/sign");
    goto("/out");
  }

  let searchQuery = $state('');
  async function search() {
    goto('/search?q=' + encodeURIComponent(searchQuery));
  }
</script>

<header class="p-2 grid grid-cols-3 justify-between flex-wrap w-full z-40">
  <form class="relative flex-1 md:grow-0" onsubmit={preventDefault(search)}>
    <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground outline-hidden" />
    <Input
      type="search"
      placeholder="Search..."
      bind:value={searchQuery}
      class="w-full rounded-lg bg-neutral-300 dark:bg-neutral-600 pl-8 md:w-[200px] lg:w-[320px]"
    />
  </form>
  <a href="/" class="mx-auto"
    ><img src="/logo.png" class="h-14 mx-auto" alt="ReverseTV" /></a
  >
  {#if user}
    <Popover.Root>
      <Popover.Trigger class="inline-flex ml-auto h-min">
        <div class="flex flex-row items-center gap-2">
          <span>{user.user.username}</span>
          <Avatar.Root>
            <Avatar.Image
              alt={user.user.username}
              src={user.user.images.avatar.full}
            />
            <Avatar.Fallback
              >{user.user.username.toUpperCase()[0]}</Avatar.Fallback
            >
          </Avatar.Root>
        </div>
      </Popover.Trigger>
      <Popover.Content class="mt-1"
        ><Button variant="destructive" class="w-full" on:click={signOut}
          >Sign out</Button
        ></Popover.Content
      >
    </Popover.Root>
  {:else}
    <Button
      href="https://trakt.tv/oauth/authorize?client_id={PUBLIC_TRAKT_ID}&redirect_uri=https://reversetv.enzon19.com/authorized&response_type=code"
      class="ml-auto">Continue with Trakt</Button
    >
  {/if}
</header>

<div class="grow p-2">{@render children?.()}</div>

<footer class="bg-neutral-400 dark:bg-neutral-700 text-center text-sm p-2 z-30 mt-2">
  <span>Made by <a href="https://enzon19.com" class="underline">enzon19</a>. Donate at <a class="underline" href="https://ko-fi.com/enzon19">Ko-fi</a>.</span>
</footer>

<style lang="postcss">
  @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");
</style>
