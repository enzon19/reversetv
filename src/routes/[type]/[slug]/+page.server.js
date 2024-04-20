import {getMovieData, getShowData} from '$lib/utils/getTraktData';
import { redirect } from "@sveltejs/kit";

export async function load({params, cookies, parent}) {
  const { user } = await parent();
  if (!user) throw redirect(303, '/');

  const item = params.type === 'movies' ? await getMovieData(params.slug) : await getShowData(params.slug);
  return {item, id: item.ids.tmdb, type: params.type, acc: cookies.get('access_token')};
};