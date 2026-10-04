import type { PageServerLoad } from './$types';
import { providerFor } from '$lib/server/providers';
import { getShowData } from '$lib/utils/getTraktData';
import { getShowHistory } from '$lib/utils/getUserHistory.js';

export const load: PageServerLoad = async ({ params, cookies, parent }) => {
	await parent();
	const slug = params.slug;

	const showData = await getShowData(slug, providerFor(cookies)); // basic info
	const showHistoryForUser = await getShowHistory(slug, cookies.get('access_token'), providerFor(cookies)); // for seasons, episodes + progress

	return {
		item: { ...showData, ...showHistoryForUser }
	};
}
