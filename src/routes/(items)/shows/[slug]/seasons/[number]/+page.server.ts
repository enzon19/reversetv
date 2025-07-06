import { getShowData } from '$lib/utils/getTraktData';
import { getShowHistory } from '$lib/utils/getUserHistory.js';
import { redirect } from '@sveltejs/kit';

export async function load({ params, cookies }) {
	const slug = params.slug;
	let seasonNumber = parseInt(params.number || '1');

	if (isNaN(seasonNumber)) redirect(303, '/shows/' + params.slug);
	const showHistoryForUser = await getShowHistory(slug, cookies.get('access_token')); // for seasons, episodes + progress
	if (seasonNumber > showHistoryForUser.seasons.length - 1 || seasonNumber < 0) redirect(303, '/shows/' + params.slug);

	const showData = await getShowData(slug); // basic info

	return {
		item: { ...showData, ...showHistoryForUser },
		seasonNumber
	};
}
