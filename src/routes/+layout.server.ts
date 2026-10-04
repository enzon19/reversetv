import { providerFor, getUser, tokens, saveSession, clearSession, ProviderError } from '$lib/server/providers';
import type { LayoutServerLoad } from './$types';
export const load: LayoutServerLoad = async ({ cookies, fetch }) => {
 const provider = providerFor(cookies);
 let user: TraktUser | undefined;
 const access = cookies.get('access_token');
 const refresh = cookies.get('refresh_token');
 try {
  if (access) user = await getUser(provider, access, fetch);
  else if (refresh) {
   const data = await tokens(provider, { refresh_token: refresh }, fetch);
   saveSession(cookies, provider, data);
   user = await getUser(provider, data.access_token, fetch);
  }
 } catch (e) {
  if (!(e instanceof ProviderError) || e.status !== 401) throw e;
  if (access && refresh) {
   try {
    const data = await tokens(provider, { refresh_token: refresh }, fetch);
    saveSession(cookies, provider, data);
    user = await getUser(provider, data.access_token, fetch);
   } catch (refreshError) {
    if (!(refreshError instanceof ProviderError) || refreshError.status !== 401) throw refreshError;
    clearSession(cookies);
   }
  } else clearSession(cookies);
 }
 return { user, provider };
};
