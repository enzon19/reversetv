import { PUBLIC_TMDB_KEY } from '$env/static/public';

type TMDBPerson = {
	adult: boolean;
	gender: number;
	id: number;
	known_for_department: string;
	name: string;
	original_name: string;
	popularity: number;
	profile_path: string | null;
};

export type TMDBMovieCastMember = TMDBPerson & {
	cast_id?: number;
	character: string;
	credit_id: string;
	order: number;
};

export type TMDBMovieCrewMember = TMDBPerson & {
	credit_id: string;
	department: string;
	job: string;
};

export type TMDBMovieCredits = {
	id: number;
	cast: TMDBMovieCastMember[];
	crew: TMDBMovieCrewMember[];
};

export type TMDBShowCastMember = TMDBPerson & {
	total_episode_count: number;
	roles: {
		credit_id: string;
		character: string;
		episode_count: number;
	}[];
	order: number;
};

export type TMDBShowCrewMember = TMDBPerson & {
	total_episode_count: number;
	department: string;
	jobs: {
		credit_id: string;
		job: string;
		episode_count: number;
	}[];
};

export type TMDBShowCredits = {
	id: number;
	cast: TMDBShowCastMember[];
	guest_stars?: TMDBShowCastMember[];
	crew: TMDBShowCrewMember[];
};

export type TMDBPersonCastMember = {
	adult: boolean;
	backdrop_path: string | null;
	genre_ids: number[];
	id: string;
	original_language: string;
	original_title: string;
	overview: string;
	popularity: number;
	poster_path: string | null;
	release_date: string;
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
	character: string;
	credit_id: string;
	order: number;
	media_type: 'movie' | 'tv';
};

export type TMDBPersonCrewMember = {
	adult: boolean;
	backdrop_path: string | null;
	genre_ids: number[];
	id: number;
	original_language: string;
	original_title: string;
	overview: string;
	popularity: number;
	poster_path: string | null;
	release_date: string;
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
	credit_id: string;
	department: string;
	job: string;
	media_type: 'movie' | 'tv';
};

export type TMDBPersonCredits = {
	cast: TMDBPersonCastMember[];
	crew: TMDBPersonCrewMember[];
	id: number;
};

export async function getMovieCredits(movieID: number) {
	const headers = {
		accept: 'application/json',
		Authorization: `Bearer ${PUBLIC_TMDB_KEY}`
	};

	const creditsRequest = await fetch(
		`https://api.themoviedb.org/3/movie/${movieID}/credits?language=en-US`,
		{
			method: 'GET',
			headers
		}
	);
	const creditsData = (await creditsRequest.json()) as TMDBMovieCredits;

	return creditsData.cast;
}

export async function getShowCredits(showID: number) {
	const headers = {
		accept: 'application/json',
		Authorization: `Bearer ${PUBLIC_TMDB_KEY}`
	};

	const creditsRequest = await fetch(
		`https://api.themoviedb.org/3/tv/${showID}/aggregate_credits?language=en-US`,
		{
			method: 'GET',
			headers
		}
	);
	const creditsData = (await creditsRequest.json()) as TMDBShowCredits;

	return creditsData.cast;
}

export async function getSeasonCredits(showID: number, seasonNumber: number) {
	const headers = {
		accept: 'application/json',
		Authorization: `Bearer ${PUBLIC_TMDB_KEY}`
	};

	const creditsRequest = await fetch(
		`https://api.themoviedb.org/3/tv/${showID}/season/${seasonNumber}/aggregate_credits?language=en-US`,
		{
			method: 'GET',
			headers
		}
	);
	const creditsData = await creditsRequest.json();

	return creditsData.cast as TMDBShowCredits;
}

export async function getEpisodeCredits(showID: number, itemsNumber: number[]) {
	const headers = {
		accept: 'application/json',
		Authorization: `Bearer ${PUBLIC_TMDB_KEY}`
	};

	const creditsRequest = await fetch(
		`https://api.themoviedb.org/3/tv/${showID}/season/${itemsNumber[0]}/episode/${itemsNumber[1]}/credits?language=en-US`,
		{
			method: 'GET',
			headers
		}
	);
	const creditsData = (await creditsRequest.json()) as TMDBShowCredits;

	if (creditsData.guest_stars) {
		return [...creditsData.cast, ...creditsData.guest_stars];
	} else {
		return creditsData.cast;
	}
}

export async function getPersonCredits(personID: number) {
	const headers = {
		accept: 'application/json',
		Authorization: `Bearer ${PUBLIC_TMDB_KEY}`
	};

	const creditsRequest = await fetch(
		`https://api.themoviedb.org/3/person/${personID}/combined_credits`,
		{
			method: 'GET',
			headers
		}
	);
	let creditsData = (await creditsRequest.json()) as TMDBPersonCredits;

	for (const credit of creditsData.cast) {
		credit.id = credit.media_type[0] + '_' + credit.id;
	}

	return creditsData.cast;
}
