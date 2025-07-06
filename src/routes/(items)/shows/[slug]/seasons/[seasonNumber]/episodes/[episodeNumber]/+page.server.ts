import { getShowData } from '$lib/utils/getTraktData';
import { getShowHistory } from '$lib/utils/getUserHistory.js';
import { redirect } from '@sveltejs/kit';

export async function load({ params, cookies }) {
	const slug = params.slug;
	let seasonNumber = parseInt(params.seasonNumber || '1');
	let episodeNumber = parseInt(params.episodeNumber || '1');

	if (isNaN(seasonNumber)) redirect(303, '/shows/' + params.slug);
	if (isNaN(episodeNumber)) redirect(303, `/shows/${params.slug}/seasons/${params.seasonNumber}`);
	const showHistoryForUser = await getShowHistory(slug, cookies.get('access_token')); // for seasons, episodes + progress
	if (seasonNumber > showHistoryForUser.seasons.length - 1 || seasonNumber < 0)
		redirect(303, '/shows/' + params.slug);
	if (episodeNumber > showHistoryForUser.seasons[seasonNumber].aired || episodeNumber < 1)
		redirect(303, `/shows/${params.slug}/seasons/${params.seasonNumber}`);

	const showData = await getShowData(slug); // basic info

	return {
		item: { ...showData, ...showHistoryForUser },
		seasonNumber,
		episodeNumber
	};
}
