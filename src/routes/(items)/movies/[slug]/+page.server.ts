import { getMovieData } from '$lib/utils/getTraktData';
import { getShowHistory } from '$lib/utils/getUserHistory.js';
import { redirect } from '@sveltejs/kit';

export async function load({ params }) {
	const item = await getMovieData(params.slug);

	return {
		item
	};
}
