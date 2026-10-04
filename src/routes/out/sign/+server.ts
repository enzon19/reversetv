import { TRAKT_SECRET } from '$env/static/private';
import { providerFor, request, clientId, clearSession } from '$lib/server/providers';
import type { RequestHandler } from './$types';
export const POST: RequestHandler = async ({ cookies, fetch }) => {
 const provider = providerFor(cookies);
 const token = cookies.get('access_token');
 try {
  if (token) await request(provider, provider === 'trakt' ? '/oauth/revoke' : '/oauth/logout', token,
   provider === 'trakt' ? { token, client_id: clientId(provider), client_secret: TRAKT_SECRET } : { refresh_token: cookies.get('refresh_token') }, fetch);
 } catch {
  // Local sign-out must work even when the provider is unavailable or the token expired.
 } finally { clearSession(cookies); }
 return new Response('Success');
};
