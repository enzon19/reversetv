import { getShowData } from '$lib/utils/getTraktData';
import { getShowHistory } from '$lib/utils/getUserHistory.js';

export async function load({ params, cookies }) {
	const slug = params.slug;

	const showData = await getShowData(slug); // basic info
	const showHistoryForUser = await getShowHistory(slug, cookies.get('access_token')); // for seasons, episodes + progress

	return {
		item: { ...showData, ...showHistoryForUser }
	};
}
