import type { PageServerLoad } from './$types';
import { providerFor } from '$lib/server/providers';
import { getShowData } from '$lib/utils/getTraktData';
import { getShowHistory } from '$lib/utils/getUserHistory.js';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, cookies, parent }) => {
	await parent();
	const slug = params.slug;
	let seasonNumber = parseInt(params.seasonNumber || '1');

	if (isNaN(seasonNumber)) redirect(303, '/shows/' + params.slug);

	const showHistoryForUser = await getShowHistory(slug, cookies.get('access_token'), providerFor(cookies)); // for seasons, episodes + progress

	const season = showHistoryForUser.seasons.find((e) => e.number === seasonNumber);
	if (!season) redirect(303, '/shows/' + params.slug);

	const showData = await getShowData(slug, providerFor(cookies)); // basic info

	return {
		item: { ...showData, ...showHistoryForUser },
		seasonNumber
	};
}
