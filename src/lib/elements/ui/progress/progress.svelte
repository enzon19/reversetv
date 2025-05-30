<script>
	import { Progress as ProgressPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	/** @type {{class?: any, max?: number, value?: any, [key: string]: any}} */
	let { class: className = undefined, max = 100, value = undefined, ...rest } = $props();
	
</script>

<ProgressPrimitive.Root
	class={cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className)}
	{...rest}
>
	<div
		class="h-full w-full flex-1 bg-primary transition-all"
		style={`transform: translateX(-${100 - (100 * (value ?? 0)) / (max ?? 1)}%)`}
	></div>
</ProgressPrimitive.Root>
