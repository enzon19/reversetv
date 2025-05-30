<script>
  import { PUBLIC_TMDB_KEY } from "$env/static/public";

  import { Skeleton } from "$lib/elements/ui/skeleton";

  /** @type {{title: any, id: any, type: any, href: any, date: any, src: any}} */
  let {
    title,
    id,
    type,
    href,
    date,
    src = $bindable()
  } = $props();

  async function generateCover() {
    const headers = {
      accept: 'application/json',
      Authorization: 'Bearer ' + PUBLIC_TMDB_KEY
    };

    const imagesRequest = await fetch(`https://api.themoviedb.org/3/${type == 'shows' ? 'tv' : 'movie'}/${id}/images?language=en`, {
      method: 'GET',
      headers
    });
    const imagesData = await imagesRequest.json();
    return 'https://image.tmdb.org/t/p/w200' + imagesData?.posters[0].file_path || 'https://pudim.com.br/pudim.jpg';
  }

  if (!src) src = generateCover();
</script>

<a {href} class="flex flex-col items-center gap-2 {href ? "hover:scale-105 transition-all duration-300" : ""}">
  {#await src}
    <Skeleton class="h-64 rounded-xl w-full" />
  {:then src}
    <img {src} alt={title} class="h-64">
  {/await}
  <div class="text-center flex flex-col gap-0.5">
    <span class="text-neutral-800 dark:text-neutral-100 truncate text-ellipsis w-40" {title}>{title}</span>
    {#if date}
      <span class="text-xs text-neutral-600 dark:text-neutral-400">{date}</span>
    {/if}
  </div>
</a>