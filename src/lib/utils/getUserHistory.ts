import { PUBLIC_TRAKT_ID } from '$env/static/public';

export type TraktMovie = {
	plays: number;
	type: 'movie';
	last_watched_at: string;
	last_updated_at: string;
	movie: {
		title: string;
		year: number;
		ids: TraktIDs;
	};
};

export type TraktShow = {
	plays: number;
	type: 'show';
	last_watched_at: string;
	last_updated_at: string;
	reset_at: string;
	show: {
		title: string;
		year: number;
		ids: TraktIDs;
	};
	seasons: {
		number: Number;
		episodes: {
			number: number;
			plays: number;
			last_watched_at: string;
		}[];
	}[];
};

export type TraktShowHistory = {
	aired: number;
	completed: number;
	last_watched_at: string | null;
	reset_at: string | null;
	seasons: Season[];
	hidden_seasons: Season[];
	next_episode: EpisodeDetails | null;
	last_episode: EpisodeDetails | null;
};

type Season = {
	number: number;
	title: string | null;
	aired: number;
	completed: number;
	episodes: {
		number: number;
		completed: boolean;
		last_watched_at: string;
	}[];
};

type EpisodeDetails = {
	season: number;
	number: number;
	title: string;
	ids: TraktIDs;
};

export async function getUserMoviesHistory(username: string, acc?: string) {
	const headers = {
		'Content-Type': 'application/json',
		Authorization: 'Bearer ' + acc,
		'trakt-api-version': '2',
		'trakt-api-key': PUBLIC_TRAKT_ID
	};

	const moviesRequest = await fetch(`https://api.trakt.tv/users/${username}/watched/movies`, {
		method: 'GET',
		headers
	});

	const moviesData: TraktMovie[] = await moviesRequest.json();
	return moviesData.map((e) => ({ ...e, type: 'movie' as const }));
}

export async function getUserShowsHistory(username: string, acc?: string) {
	const headers = {
		'Content-Type': 'application/json',
		Authorization: 'Bearer ' + acc,
		'trakt-api-version': '2',
		'trakt-api-key': PUBLIC_TRAKT_ID
	};

	const showsRequest = await fetch(`https://api.trakt.tv/users/${username}/watched/shows`, {
		method: 'GET',
		headers
	});

	const showsData: TraktShow[] = await showsRequest.json();
	return showsData.map((e) => ({ ...e, type: 'show' as const }));
}

export async function getShowHistory(slug: string | number, acc?: string) {
	const headers = {
		'Content-Type': 'application/json',
		Authorization: 'Bearer ' + acc,
		'trakt-api-version': '2',
		'trakt-api-key': PUBLIC_TRAKT_ID
	};

	const showRequest = await fetch(
		`https://api.trakt.tv/shows/${slug}/progress/watched?specials=true&count_specials=false`,
		{
			method: 'GET',
			headers
		}
	);

	const showData: TraktShowHistory = await showRequest.json();
	return showData;
}

export async function getUserFullHistoryIDs(
	username: string,
	acc: string,
	type: keyof TraktIDs = 'tmdb'
) {
	const movies = await getUserMoviesHistory(username, acc);
	const shows = await getUserShowsHistory(username, acc);

	return [
		...movies.map(({ movie }) => 'm_' + movie.ids[type]),
		...shows.map(({ show }) => 't_' + show.ids[type])
	];
}
