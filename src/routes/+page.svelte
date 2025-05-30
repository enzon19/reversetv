<script lang="ts">
  import { PUBLIC_TRAKT_ID } from '$env/static/public';
  import { Button } from '$lib/elements/ui/button';
  import * as Alert from "$lib/elements/ui/alert/index.js";
  import Poster from '$lib/components/Poster.svelte';
  import Bulb from 'svelte-ionicons/Bulb.svelte';
  import lodash from 'lodash';

  let { data } = $props();
  let {user, history} = data;
</script>

{#if user}
  <Alert.Root class="bg-yellow-600/15 mb-6 container">
    <Bulb class="outline-hidden" size="1rem"/>
    <Alert.Title class="font-semibold">Tip</Alert.Title>
    <Alert.Description>You can change any <strong>trakt.tv</strong> url to <strong>reversetv.enzon19.com</strong> to know about the connections of that movie or show and your history. For example: trakt.tv/movies/the-matrix-1999 => reversetv.enzon19.com/movies/the-matrix-1999</Alert.Description>
  </Alert.Root>
  <div class="container mt-2">
    <h2 class="text-2xl font-semibold text-center sm:text-left">Last Watched</h2>
    <div class="grid gap-3 mt-2" style="grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));">
      {#each history.sort((a, b) => (new Date(a.last_watched_at)) - (new Date(b.last_watched_at))).reverse().slice(0, 6) as item}
        {@const itemType = item.show ? 'shows' : 'movies'}
        <Poster title={item.show?.title || item.movie?.title} id={item.show?.ids.tmdb || item.movie?.ids.tmdb} href={`/${itemType}/` + (item.show?.ids.slug || item.movie?.ids.slug)} date={item.last_watched_at} type={itemType}/>
      {/each}
    </div>
  </div>
  <div class="container mt-4">
    <h2 class="text-2xl font-semibold text-center sm:text-left">Random Items Watched</h2>
    <span class="text-sm font-normal mx-auto block text-center sm:text-left sm:mx-right sm:inline">powered by <a href="https://randomtv.enzon19.com" class="underline" target="_blank">RandomTV for Trakt</a></span>
    <div class="grid gap-3 mt-2" style="grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));">
      {#each lodash.shuffle(history).slice(0, 6) as item}
        {@const itemType = item.show ? 'shows' : 'movies'}
        <Poster title={item.show?.title || item.movie?.title} id={item.show?.ids.tmdb || item.movie?.ids.tmdb} href={`/${itemType}/` + (item.show?.ids.slug || item.movie?.ids.slug)} type={itemType}/>
      {/each}
    </div>  
  </div>
{:else}
  <h2 class="text-2xl container text-center mt-2 mx-auto">To start, please continue with Trakt.</h2>
  <div class="text-neutral-800 dark:text-neutral-400 mt-2 text-center lg:w-[50%] mx-auto">Connect with Trakt to analyze common actors across your watched movies and TV shows, highlighting connections between the productions.</div>
  <!-- update: Divulgação material -->
{/if}