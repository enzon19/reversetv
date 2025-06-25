import { PUBLIC_TRAKT_ID } from '$env/static/public';
import { TRAKT_SECRET } from '$env/static/private';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
	const body = {
		token: cookies.get('access_token'),
		client_id: PUBLIC_TRAKT_ID,
		client_secret: TRAKT_SECRET
	};

	const request = await fetch('https://api.trakt.tv/oauth/revoke', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});

	if (request.status !== 200) return new Response('Error', { status: 500 });
	return new Response('Success', { status: 200 });
};
