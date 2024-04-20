<script>
  export let data;
  // import { Button } from '$lib/elements/ui/button';
</script>

<!-- {#if data.code}
  <div class="flex flex-col gap-1 mt-2">
    <h2 class="text-2xl mx-auto">Nice! You're authenticate.</h2>
    <Button href="/" class="mx-auto">Start</Button>
  </div>
{:else} -->
  <h2 class="text-2xl container text-center mt-2 font-semibold">Ops.</h2>
  <p class="text-sm container text-center text-neutral-500 font-semibold">{data.error}</p>
<!-- {/if} -->