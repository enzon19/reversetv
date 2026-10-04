import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getUserFullHistoryIDs } from '$lib/utils/getUserHistory';
import { providerFor } from '$lib/server/providers';
export const load: LayoutServerLoad = async ({ cookies, parent }) => {
 const { user } = await parent();
 if (!user) redirect(303, '/');
 return { historyIDs: await getUserFullHistoryIDs('me', cookies.get('access_token')!, 'tmdb', providerFor(cookies)) };
}
