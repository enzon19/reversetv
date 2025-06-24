import type { HandleClientError } from '@sveltejs/kit';

declare global {
	namespace App {
		interface Locals {
			username: string;
		}
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	type User = {
		username: string;
		images: {
			avatar: {
				full: string;
			};
		};
	};
}

export {};
