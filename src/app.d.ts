import type { HandleClientError } from '@sveltejs/kit';

declare global {
	namespace App {
		interface Locals {
			user: User;
		}
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

type User = {
	text: string;
};

export {};
