import { PUBLIC_TRAKT_ID } from '$env/static/public';
import { getUserMoviesHistory, getUserShowsHistory } from '$lib/utils/getUserHistory';

export async function load({ parent, cookies }) {
	const { user } = await parent();

	if (!user) return {};

	const movies = await getUserMoviesHistory(user.user.username, cookies.get('access_token'));
	const shows = await getUserShowsHistory(user.user.username, cookies.get('access_token'));

	const history = [...movies, ...shows];

	return { history };
}
