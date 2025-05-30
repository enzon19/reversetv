import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import Icons from 'unplugin-icons/vite';

export default defineConfig({
	plugins: [sveltekit(),
		tailwindcss(),
		Icons({
			compiler: 'svelte',
			iconCustomizer(collection, icon, props) {
				if (![].includes(collection)) {
					props.width = '24';
					props.height = '24';
				}
			}
		})]
});
