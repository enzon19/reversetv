<script>
  import Poster from '$lib/components/Poster.svelte';
  export let data;
  $: query = data.query;
  $: results = data.searchResults;
  $: console.log(results)
</script>

<div class="sm:container">
  <h1 class="text-3xl font-black mb-2 text-center sm:text-left">Results for "{query}"</h1>
  <div class="grid gap-3 mt-2" style="grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));">
    {#each results as item}
      <Poster title={item[item.type].title} id={item[item.type].ids.tmdb} href={`/${item.type}s/` + item[item.type].ids.slug} type={item.type + 's'}/>
    {/each}
  </div>
</div>