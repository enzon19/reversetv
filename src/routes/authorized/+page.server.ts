import { PUBLIC_TRAKT_ID, PUBLIC_HOSTNAME } from '$env/static/public';
import { TRAKT_SECRET } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, cookies, parent }) => {
	const { user } = await parent();
	if (user) redirect(303, '/');

	const code = url.searchParams.get('code');

	const body = {
		code,
		client_id: PUBLIC_TRAKT_ID,
		client_secret: TRAKT_SECRET,
		redirect_uri: PUBLIC_HOSTNAME + '/authorized',
		grant_type: 'authorization_code'
	};

	const request = await fetch('https://api.trakt.tv/oauth/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});

	const data = await request.json();
	cookies.set('access_token', data.access_token, { path: '/' });

	if (data.error) return { error: data.error_description };
	throw redirect(303, '/');
};
