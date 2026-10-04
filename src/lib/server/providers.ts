import { env } from '$env/dynamic/private';
import { PUBLIC_TRAKT_ID, PUBLIC_HOSTNAME } from '$env/static/public';
import { TRAKT_SECRET } from '$env/static/private';
import { dev } from '$app/environment';
import type { Cookies } from '@sveltejs/kit';

export type Provider = 'trakt' | 'wetrakr';
export const providerFor = (cookies: Cookies): Provider =>
	cookies.get('provider') === 'wetrakr' ? 'wetrakr' : 'trakt';
export const cookieOptions = { path: '/', httpOnly: true, secure: !dev, sameSite: 'lax' as const };
export const callback = (provider: Provider) => PUBLIC_HOSTNAME + (provider === 'trakt' ? '/authorized' : '/authorized/wetrakr');
export const clientId = (provider: Provider) => provider === 'trakt' ? PUBLIC_TRAKT_ID : env.WETRAKR_CLIENT_ID;
export const baseURL = (provider: Provider) => provider === 'trakt' ? 'https://api.trakt.tv' : 'https://api.wetrakr.com';
export function headers(provider: Provider, token?: string): Record<string, string> {
	return {
		'Content-Type': 'application/json',
		'User-Agent': 'ReverseTV/0.1.8',
		[`${provider}-api-version`]: provider === 'trakt' ? '2' : '1',
		[`${provider}-api-key`]: clientId(provider) || '',
		...(token ? { Authorization: `Bearer ${token}` } : {})
	};
}
export class ProviderError extends Error {
	constructor(public status: number) { super(`Tracking provider returned ${status}`); }
}
export async function request(provider: Provider, path: string, token?: string, body?: object, fetcher = fetch) {
	const response = await fetcher(baseURL(provider) + path, {
		method: body ? 'POST' : 'GET', headers: headers(provider, token),
		...(body ? { body: JSON.stringify(body) } : {})
	});
	if (!response.ok) throw new ProviderError(response.status);
	return response.json();
}
export async function tokens(provider: Provider, grant: { code: string; code_verifier?: string } | { refresh_token: string }, fetcher = fetch) {
	const refreshing = 'refresh_token' in grant;
	const body = provider === 'trakt' ? {
		...grant, client_id: PUBLIC_TRAKT_ID, client_secret: TRAKT_SECRET,
		redirect_uri: callback(provider), grant_type: refreshing ? 'refresh_token' : 'authorization_code'
	} : refreshing ? grant : {
		...grant, client_id: clientId(provider), ...(env.WETRAKR_CLIENT_SECRET ? { client_secret: env.WETRAKR_CLIENT_SECRET } : {})
	};
	return request(provider, refreshing && provider === 'wetrakr' ? '/oauth/token/refresh' : '/oauth/token', undefined, body, fetcher);
}
export function saveSession(cookies: Cookies, provider: Provider, data: { access_token: string; refresh_token: string; expires_in: number }) {
	if (!data.access_token || !data.refresh_token || !(data.expires_in > 0)) throw new Error('Invalid token response');
	cookies.set('access_token', data.access_token, { ...cookieOptions, maxAge: data.expires_in });
	cookies.set('refresh_token', data.refresh_token, { ...cookieOptions, maxAge: 86400 * (provider === 'wetrakr' ? 180 : 365) });
	cookies.set('provider', provider, { ...cookieOptions, maxAge: 86400 * (provider === 'wetrakr' ? 180 : 365) });
}
export function clearSession(cookies: Cookies) {
	for (const name of ['access_token', 'refresh_token', 'provider']) cookies.delete(name, { path: '/' });
}
export async function getUser(provider: Provider, token: string, fetcher = fetch): Promise<TraktUser> {
	const data = await request(provider, provider === 'trakt' ? '/users/settings' : '/account/settings', token, undefined, fetcher);
	if (provider === 'trakt') return data.user;
	return { username: data.info.username, images: { avatar: { full: data.images?.avatar ? `https://api.wetrakr.com/uploads/avatars/${encodeURIComponent(data.images.avatar)}` : '' } } };
}
