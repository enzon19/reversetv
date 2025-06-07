import { PUBLIC_TRAKT_ID } from "$env/static/public";

export async function getUserMoviesHistory(username, acc) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + acc,
    'trakt-api-version': '2',
    'trakt-api-key': PUBLIC_TRAKT_ID
  };
  
  const moviesRequest = await fetch(`https://api.trakt.tv/users/${username}/watched/movies`, {
    method: 'GET',
    headers
  });
  const moviesData = await moviesRequest.json();

  return moviesData;
}

export async function getUserShowsHistory(username, acc) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + acc,
    'trakt-api-version': '2',
    'trakt-api-key': PUBLIC_TRAKT_ID
  };

  const showsRequest = await fetch(`https://api.trakt.tv/users/${username}/watched/shows`, {
    method: 'GET',
    headers
  });
  const showsData = await showsRequest.json();

  return showsData;
}

export async function getUserFullHistoryIDs(username, acc, type = "tmdb") {
  const movies = await getUserMoviesHistory(username, acc);
  const shows = await getUserShowsHistory(username, acc);
  return [...movies.map(({movie}) => 'm_' + movie.ids[type]), ...shows.map(({show}) => 't_' + show.ids[type])];
}

// https://developer.themoviedb.org/reference/tv-series-aggregate-credits
/* [
     223,  41059, 753342,    213, 572802, 559969,
  438631, 401981,  72241,  43739,  34689,  31602,
   30159,  28580,  24973,  18299,  16515,  13528,
   10785,   6620,   4808,   4175,   2690,    907,
     702,    595,    574,  65494,  63639,  60622,
  135918,  95888,  44264, 211180,  60574,  82856,
    1438,   4194,  85862,  56570,  94997,   1399,
   67198,   2419,  44217,  65708,  84534, 156993,
   64684,  71712,  81723,  63247,   1396,  84773
]*/