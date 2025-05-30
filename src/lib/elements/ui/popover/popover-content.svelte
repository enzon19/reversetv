<script>
	import { Popover as PopoverPrimitive } from "bits-ui";
	import { cn, flyAndScale } from "$lib/utils.js";
	/** @type {{class?: any, transition?: any, transitionConfig?: any, align?: string, sideOffset?: number, children?: import('svelte').Snippet, [key: string]: any}} */
	let {
		class: className = undefined,
		transition = flyAndScale,
		transitionConfig = undefined,
		align = "center",
		sideOffset = 4,
		children,
		...rest
	} = $props();
	
</script>

<PopoverPrimitive.Content
	{transition}
	{transitionConfig}
	{align}
	{sideOffset}
	{...rest}
	class={cn(
		"z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
		className
	)}
>
	{@render children?.()}
</PopoverPrimitive.Content>
