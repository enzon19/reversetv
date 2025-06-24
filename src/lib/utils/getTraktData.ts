import { PUBLIC_TRAKT_ID } from '$env/static/public';

export type IDs = {
	trakt: number;
	tvdb: number;
	imdb: string;
	tmdb: number;
	tvrage: any;
};

export type TraktShow = {
	title: string;
	year: number;
	ids: IDs;
	episodes: {
		season: number;
		number: number;
		title: string;
		ids: IDs;
	}[];
};

export async function getMovieData(slug: string) {
	const headers = {
		'Content-Type': 'application/json',
		'trakt-api-version': '2',
		'trakt-api-key': PUBLIC_TRAKT_ID
	};

	const movieRequest = await fetch(`https://api.trakt.tv/movies/${slug}`, {
		method: 'GET',
		headers
	});
	const movieData = await movieRequest.json();

	return movieData;
}

export async function getShowData(slug: string) {
	const headers = {
		'Content-Type': 'application/json',
		'trakt-api-version': '2',
		'trakt-api-key': PUBLIC_TRAKT_ID
	};

	const showRequest = await fetch(`https://api.trakt.tv/shows/${slug}`, {
		method: 'GET',
		headers
	});
	const showData = await showRequest.json();

	const seasonRequest = await fetch(
		`https://api.trakt.tv/shows/${slug}/seasons?extended=episodes`,
		{
			method: 'GET',
			headers
		}
	);
	const seasonData = await seasonRequest.json();

	return { ...showData, episodes: seasonData.map((e: any) => e.episodes.length) } as TraktShow;
}

export async function searchData(query: string) {
	const headers = {
		'Content-Type': 'application/json',
		'trakt-api-version': '2',
		'trakt-api-key': PUBLIC_TRAKT_ID
	};

	const searchRequest = await fetch(`https://api.trakt.tv/search/movie,show/?query=${query}`, {
		method: 'GET',
		headers
	});
	const searchResponse = await searchRequest.json();

	return searchResponse;
}
