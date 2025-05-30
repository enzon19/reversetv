<script>
	import { Avatar as AvatarPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	/** @type {{class?: any, children?: import('svelte').Snippet, [key: string]: any}} */
	let { class: className = undefined, children, ...rest } = $props();
	
</script>

<AvatarPrimitive.Fallback
	class={cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className)}
	{...rest}
>
	{@render children?.()}
</AvatarPrimitive.Fallback>
