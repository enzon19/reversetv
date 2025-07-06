import { PUBLIC_TRAKT_ID } from '$env/static/public';
import {
	getShowHistory,
	getUserMoviesHistory,
	getUserShowsHistory
} from '$lib/utils/getUserHistory';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, cookies }) => {
	const { user } = await parent();

	if (!user) return {};

	const movies = await getUserMoviesHistory(user.username, cookies.get('access_token'));
	const shows = await getUserShowsHistory(user.username, cookies.get('access_token'));

	const history = [...movies, ...shows];

	return { history };
};
