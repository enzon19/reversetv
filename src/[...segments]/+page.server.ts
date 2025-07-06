import { getMovieData, getShowData } from '$lib/utils/getTraktData';
import { getShowHistory } from '$lib/utils/getUserHistory.js';
import { redirect } from '@sveltejs/kit';

export async function load({ params, cookies, parent }) {
	const { user } = await parent();
	if (!user) redirect(303, '/');

	const type = params.type.toString() as Items;
	if (!['movies', 'shows'].includes(type)) redirect(303, '/');

	const itemFunctions = {
		movies: getMovieData,
		shows: async (id: string, acc: string) => {
			const showData = await getShowData(id); // basic info
			const showHistoryForUser = await getShowHistory(id, acc); // for seasons, episodes + progress

			return { ...showData, ...showHistoryForUser };
		}
	};
	const item = await itemFunctions[type](params.slug, cookies.get('access_token'));
	// console.log(item);

	return {
		item,
		type,
		acc: cookies.get('access_token')
	};
}
