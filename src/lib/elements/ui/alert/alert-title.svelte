<script>
	import { cn } from "$lib/utils.js";
	/** @type {{class?: any, level?: string, children?: import('svelte').Snippet, [key: string]: any}} */
	let { class: className = undefined, level = "h5", children, ...rest } = $props();
	
</script>

<svelte:element
	this={level}
	class={cn("mb-1 font-medium leading-none tracking-tight", className)}
	{...rest}
>
	{@render children?.()}
</svelte:element>
