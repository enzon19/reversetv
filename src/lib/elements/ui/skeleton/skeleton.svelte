<script>
	import { cn } from "$lib/utils.js";
	let className = undefined;
	export { className as class };
</script>

<div class={cn("animate-pulse rounded-md bg-primary/10", className)} {...$$restProps} />
