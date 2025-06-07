import {searchData} from '$lib/utils/getTraktData';

export async function load({ url }) {
  const query = url.searchParams.get('q');
  const searchResults = await searchData(query);
  
  return {query, searchResults};
};