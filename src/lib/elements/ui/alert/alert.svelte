<script>
	import { alertVariants } from "./index.js";
	import { cn } from "$lib/utils.js";
	/** @type {{class?: any, variant?: string, children?: import('svelte').Snippet, [key: string]: any}} */
	let { class: className = undefined, variant = "default", children, ...rest } = $props();
	
</script>

<div class={cn(alertVariants({ variant }), className)} {...rest} role="alert">
	{@render children?.()}
</div>
