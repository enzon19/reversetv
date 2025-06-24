import { PUBLIC_TRAKT_ID } from '$env/static/public';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ cookies }) => {
	let user: User | undefined;

	try {
		const request = await fetch('https://api.trakt.tv/users/settings', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + cookies.get('access_token'),
				'trakt-api-version': '2',
				'trakt-api-key': PUBLIC_TRAKT_ID
			}
		});

		const data = await request.json();
		user = data.user;
	} catch (e) {
		console.error('Error getting user:', e);
	}

	return { user };
};
