import { PUBLIC_TRAKT_ID } from '$env/static/public';
import { getUserMoviesHistory, getUserShowsHistory } from '$lib/utils/getUserHistory';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ parent, cookies }) => {
	const { user }: { user?: User } = await parent();

	if (!user) return {};

	const movies = await getUserMoviesHistory(user?.username, cookies.get('access_token'));
	const shows = await getUserShowsHistory(user?.username, cookies.get('access_token'));

	const history = [...movies, ...shows];

	return { history };
};
