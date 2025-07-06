import type { HandleClientError } from '@sveltejs/kit';
import 'unplugin-icons/types/svelte';

declare global {
	namespace App {
		// interface Locals {}
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	type Items = 'movies' | 'shows' | 'seasons' | 'episodes';

	type TraktUser = {
		username: string;
		images: {
			avatar: {
				full: string;
			};
		};
	};

	type TraktIDs = {
		trakt: number;
		slug: string;
		tvdb?: number;
		imdb: string;
		tmdb: number;
		tvrage?: any;
	};
}

export {};
