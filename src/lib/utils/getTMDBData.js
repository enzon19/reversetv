import { PUBLIC_TMDB_KEY } from "$env/static/public";

export async function getMovieCredits(id) {
  const headers = {
    accept: 'application/json', 
    Authorization: `Bearer ${PUBLIC_TMDB_KEY}`
  };

  const creditsRequest = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`, {
    method: 'GET',
    headers
  });
  const creditsData = await creditsRequest.json();

  return creditsData.cast;
}

export async function getShowCredits(id) {
  const headers = {
    accept: 'application/json', 
    Authorization: `Bearer ${PUBLIC_TMDB_KEY}`
  };

  const creditsRequest = await fetch(`https://api.themoviedb.org/3/tv/${id}/aggregate_credits?language=en-US`, {
    method: 'GET',
    headers
  });
  const creditsData = await creditsRequest.json();

  return creditsData.cast;
}

export async function getPersonCredits(id) {
  const headers = {
    accept: 'application/json', 
    Authorization: `Bearer ${PUBLIC_TMDB_KEY}`
  };

  const creditsRequest = await fetch(`https://api.themoviedb.org/3/person/${id}/combined_credits`, {
    method: 'GET',
    headers
  });
  let creditsData = await creditsRequest.json();

  for (const credit of creditsData.cast) {
    credit.id = credit.media_type[0] + "_" + credit.id
  }
  
  return creditsData.cast;
}

// (async () => {
// console.log((await getMovieCredits(9533)).length)
// })()