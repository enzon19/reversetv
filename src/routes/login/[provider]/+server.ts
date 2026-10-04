import { redirect, error } from '@sveltejs/kit';
import { baseURL, callback, clientId, cookieOptions } from '$lib/server/providers';
import type { RequestHandler } from './$types';
export const GET: RequestHandler = async ({ params, cookies }) => {
 const provider = params.provider;
 if (provider !== 'trakt' && provider !== 'wetrakr') error(404, 'Unknown provider');
 const state = randomToken();
 const verifier = randomToken();
 cookies.set('oauth_state', state, { ...cookieOptions, maxAge: 600 });
 cookies.set('oauth_provider', provider, { ...cookieOptions, maxAge: 600 });
 cookies.set('oauth_verifier', verifier, { ...cookieOptions, maxAge: 600 });
 const url = new URL(provider === 'trakt' ? 'https://trakt.tv/oauth/authorize' : baseURL(provider) + '/oauth/authorize');
 url.search = new URLSearchParams({ client_id: clientId(provider)!, redirect_uri: callback(provider), response_type: 'code', state }).toString();
 if (provider === 'wetrakr') {
  url.searchParams.set('code_challenge', base64url(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)))));
  url.searchParams.set('code_challenge_method', 'S256');
 }
 redirect(303, url.toString());
};

function base64url(bytes: Uint8Array) {
 return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function randomToken() { return base64url(crypto.getRandomValues(new Uint8Array(32))); }
