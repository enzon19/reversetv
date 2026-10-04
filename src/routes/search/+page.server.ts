import type { PageServerLoad } from './$types';
import { providerFor } from '$lib/server/providers';
import { searchData } from '$lib/utils/getTraktData';

export const load: PageServerLoad = async ({ url, cookies, parent }) => {
	await parent();
	const query = url.searchParams.get('q')?.toString();
	const searchResults = await searchData(query, providerFor(cookies));

	return { query, searchResults };
}
