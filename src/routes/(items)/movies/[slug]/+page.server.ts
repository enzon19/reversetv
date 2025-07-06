import { getMovieData } from '$lib/utils/getTraktData';

export async function load({ params }) {
	const item = await getMovieData(params.slug);

	return {
		item
	};
}
