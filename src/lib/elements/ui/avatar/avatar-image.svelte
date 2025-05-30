<script>
	import { Avatar as AvatarPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	/** @type {{class?: any, src?: any, alt?: any, [key: string]: any}} */
	let { class: className = undefined, src = undefined, alt = undefined, ...rest } = $props();
	
</script>

<AvatarPrimitive.Image
	{src}
	{alt}
	class={cn("aspect-square h-full w-full", className)}
	{...rest}
/>
