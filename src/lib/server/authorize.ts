import { redirect } from '@sveltejs/kit';
import { tokens, saveSession, ProviderError, type Provider } from './providers';
import type { Cookies } from '@sveltejs/kit';
export async function authorize(provider: Provider, url: URL, cookies: Cookies, fetcher: typeof fetch) {
 const state = cookies.get('oauth_state');
 const expectedProvider = cookies.get('oauth_provider');
 const verifier = cookies.get('oauth_verifier');
 for (const name of ['oauth_state', 'oauth_provider', 'oauth_verifier']) cookies.delete(name, { path: '/' });
 if (!state || state !== url.searchParams.get('state') || expectedProvider !== provider) return { error: 'Login expired or invalid. Please try again.' };
 if (url.searchParams.has('error')) return { error: 'Authorization was denied. Please try again.' };
 const code = url.searchParams.get('code');
 if (!code || (provider === 'wetrakr' && !verifier)) return { error: 'Authorization code not found. Please try again.' };
 try {
  const data = await tokens(provider, { code, ...(provider === 'wetrakr' ? { code_verifier: verifier } : {}) }, fetcher);
  saveSession(cookies, provider, data);
 } catch (e) {
  if (!(e instanceof ProviderError)) throw e;
  return { error: 'Unable to complete login. Please try again.' };
 }
 redirect(303, '/');
}
