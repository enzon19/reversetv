import type { PageServerLoad } from './$types';
import { providerFor } from '$lib/server/providers';
import { getMovieData } from '$lib/utils/getTraktData';

export const load: PageServerLoad = async ({ params, cookies, parent }) => {
	await parent();
	const item = await getMovieData(params.slug, providerFor(cookies));

	return {
		item
	};
}
