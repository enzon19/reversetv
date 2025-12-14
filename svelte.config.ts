import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
export default {
	kit: {
		adapter: adapter(),
		files: {
			lib: 'src/lib'
		}
	},
	preprocess: [vitePreprocess()]
};
