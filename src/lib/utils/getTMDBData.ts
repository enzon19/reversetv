import { PUBLIC_TMDB_KEY } from '$env/static/public';

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
	const creditsData = await creditsRequest.json();

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
	const creditsData = await creditsRequest.json();

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

	return creditsData.cast;
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
	let creditsData = await creditsRequest.json();

	for (const credit of creditsData.cast) {
		credit.id = credit.media_type[0] + '_' + credit.id;
	}

	return creditsData.cast;
}
