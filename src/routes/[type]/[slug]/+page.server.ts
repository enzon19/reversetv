import { getMovieData, getShowData } from '$lib/utils/getTraktData';
import { redirect } from '@sveltejs/kit';

export async function load({ params, cookies, parent }) {
	const { user } = await parent();
	if (!user) throw redirect(303, '/');

	const item =
		params.type === 'movies' ? await getMovieData(params.slug) : await getShowData(params.slug);
		console.log(item)

	return {
		item,
		id: item.ids.tmdb,
		type: params.type,
		traktURL: params.type + '/' + params.slug,
		acc: cookies.get('access_token')
	};
}
