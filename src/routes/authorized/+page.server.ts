import { authorize } from '$lib/server/authorize';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = ({ url, cookies, fetch }) => authorize('trakt', url, cookies, fetch);
