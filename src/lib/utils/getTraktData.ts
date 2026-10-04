import { media, search } from '$lib/server/wetrakr';
import type { Provider } from '$lib/server/providers';
import { PUBLIC_TRAKT_ID } from '$env/static/public';

export type TraktItemData = {
	title: string;
	year: number;
	ids: TraktIDs;
	provider?: Provider;
};

export type TraktSearchResult = {
	type: 'movie' | 'show';
	score: number;
	show?: TraktItemData;
	movie?: TraktItemData;
}[];

export async function getMovieData(slug: string, provider: Provider = 'trakt') {
	if (provider === 'wetrakr') return media('movies', slug);
	const headers = {
		'Content-Type': 'application/json',
		'trakt-api-version': '2',
		'trakt-api-key': PUBLIC_TRAKT_ID,
		'User-Agent': 'ReverseTV/0.1.8'
	};

	const movieRequest = await fetch(`https://api.trakt.tv/movies/${slug}`, {
		method: 'GET',
		headers
	});
	const movieData = await movieRequest.json();

	return movieData as TraktItemData;
}

export async function getShowData(slug: string, provider: Provider = 'trakt') {
	if (provider === 'wetrakr') return media('shows', slug);
	const headers = {
		'Content-Type': 'application/json',
		'trakt-api-version': '2',
		'trakt-api-key': PUBLIC_TRAKT_ID,
		'User-Agent': 'ReverseTV/0.1.8'
	};

	const showRequest = await fetch(`https://api.trakt.tv/shows/${slug}`, {
		method: 'GET',
		headers
	});
	const showData = await showRequest.json();

	return showData as TraktItemData;
}

export async function searchData(query?: string, provider: Provider = 'trakt') {
	if (provider === 'wetrakr') return search(query);
	if (!query?.trim()) return [];
	const headers = {
		'Content-Type': 'application/json',
		'trakt-api-version': '2',
		'trakt-api-key': PUBLIC_TRAKT_ID,
		'User-Agent': 'ReverseTV/0.1.8'
	};

	const searchRequest = await fetch(`https://api.trakt.tv/search/movie,show/?query=${encodeURIComponent(query)}`, {
		method: 'GET',
		headers
	});
	const searchResponse = await searchRequest.json();

	return searchResponse as TraktSearchResult;
}
