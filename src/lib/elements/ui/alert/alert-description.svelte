<script>
	import { cn } from "$lib/utils.js";
	/** @type {{class?: any, children?: import('svelte').Snippet, [key: string]: any}} */
	let { class: className = undefined, children, ...rest } = $props();
	
</script>

<div class={cn("text-sm [&_p]:leading-relaxed", className)} {...rest}>
	{@render children?.()}
</div>
