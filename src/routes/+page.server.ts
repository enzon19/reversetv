import { getUserMoviesHistory, getUserShowsHistory } from '$lib/utils/getUserHistory';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, cookies }) => {
	const { user } = await parent();

	if (!user) return {};

	const movies = await getUserMoviesHistory('me', cookies.get('access_token'));
	const shows = await getUserShowsHistory('me', cookies.get('access_token'));

	const history = [...movies, ...shows];

	return { history };
};
