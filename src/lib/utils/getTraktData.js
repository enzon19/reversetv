import { PUBLIC_TRAKT_ID } from "$env/static/public";

export async function getMovieData(slug) {
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

export async function getShowData(slug) {
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

  return showData;
}

export async function searchData(query) {
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