import { getShowData } from '$lib/utils/getTraktData';
import { getShowHistory } from '$lib/utils/getUserHistory.js';
import { redirect } from '@sveltejs/kit';

export async function load({ params, cookies }) {
	const slug = params.slug;
	let seasonNumber = parseInt(params.seasonNumber || '1');
	let episodeNumber = parseInt(params.episodeNumber || '1');

	if (isNaN(seasonNumber)) redirect(303, '/shows/' + params.slug);
	if (isNaN(episodeNumber)) redirect(303, `/shows/${params.slug}/seasons/${params.seasonNumber}`);

	const showHistoryForUser = await getShowHistory(slug, cookies.get('access_token'));

	const season = showHistoryForUser.seasons.find((e) => e.number === seasonNumber);
	if (!season) redirect(303, '/shows/' + params.slug);

	if (episodeNumber > season.aired || episodeNumber < 1)
		redirect(303, `/shows/${params.slug}/seasons/${params.seasonNumber}`);

	const showData = await getShowData(slug);

	return {
		item: { ...showData, ...showHistoryForUser },
		seasonNumber,
		episodeNumber
	};
}
