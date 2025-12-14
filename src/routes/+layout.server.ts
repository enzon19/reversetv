import { PUBLIC_TRAKT_ID, PUBLIC_HOSTNAME } from '$env/static/public';
import { TRAKT_SECRET } from '$env/static/private';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, fetch }) => {
	let user: TraktUser | undefined;
	let access_token = cookies.get('access_token');
	const refresh_token = cookies.get('refresh_token');

	async function getUser(token: string) {
		const res = await fetch('https://api.trakt.tv/users/settings', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + token,
				'trakt-api-version': '2',
				'trakt-api-key': PUBLIC_TRAKT_ID
			}
		});
		if (!res.ok) throw new Error('Failed to fetch user');
		const data = await res.json();
		return data.user;
	}

	async function refreshAccessToken(refresh_token: string) {
		const body = {
			refresh_token,
			client_id: PUBLIC_TRAKT_ID,
			client_secret: TRAKT_SECRET,
			redirect_uri: PUBLIC_HOSTNAME + '/authorized',
			grant_type: 'refresh_token'
		};

		const res = await fetch('https://api.trakt.tv/oauth/token', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		});

		if (!res.ok) throw new Error('Refresh token request failed');

		const data = await res.json();
		if (data.error) throw new Error(data.error);

		return data;
	}

	try {
		if (access_token) {
			user = await getUser(access_token);
		} else {
			throw new Error('no access_token');
		}
	} catch (e) {
		if (refresh_token) {
			try {
				const data = await refreshAccessToken(refresh_token);

				cookies.set('access_token', data.access_token, {
					httpOnly: true,
					secure: true,
					sameSite: 'lax',
					path: '/',
					maxAge: 60 * 60 * 24 * 7 // 7 days
				});

				cookies.set('refresh_token', data.refresh_token, {
					httpOnly: true,
					secure: true,
					sameSite: 'lax',
					path: '/',
					maxAge: 60 * 60 * 24 * 365 // 1 year
				});

				user = await getUser(data.access_token);
			} catch (refreshError) {
				console.error('Token refresh failed:', refreshError);
				cookies.delete('access_token', { path: '/' });
				cookies.delete('refresh_token', { path: '/' });
			}
		}
	}

	return { user };
};
