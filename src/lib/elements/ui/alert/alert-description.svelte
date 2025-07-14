<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLSpanElement>> = $props();
</script>

<span
	bind:this={ref}
	data-slot="alert-description"
	class={cn(
		'col-start-2 text-sm text-neutral-700 dark:text-neutral-300 [&_p]:leading-relaxed',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</span>
