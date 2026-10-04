import { headers, request, ProviderError } from './providers';
import type { TraktMovie, TraktShow, TraktShowHistory } from '$lib/utils/getUserHistory';
import type { TraktItemData, TraktSearchResult } from '$lib/utils/getTraktData';

type Media = { id: number; type?: string; title: string; release_date?: string; first_air_date?: string; ids: { tmdb: number; imdb?: string; tvdb?: number } };
type Play = { watched_at: string; episode: { number: number; season_number: number; show: Media } };
export function normalizeMedia(media: Media): TraktItemData {
 return { title: media.title, year: Number((media.release_date || media.first_air_date || '').slice(0, 4)),
  ids: { ...media.ids, imdb: media.ids.imdb || '', trakt: 0, slug: String(media.id) }, provider: 'wetrakr' };
}
export async function paginated<T>(path: string, token: string): Promise<T[]> {
 const all: T[] = [];
 for (let page = 1; ; page++) {
  const url = new URL('https://api.wetrakr.com' + path);
  url.searchParams.set('page', String(page));
  url.searchParams.set('limit', '100');
  const res = await fetch(url, { headers: headers('wetrakr', token) });
  if (!res.ok) throw new ProviderError(res.status);
  const rows: T[] = await res.json();
  if (!Array.isArray(rows)) throw new Error('Invalid WeTrakr list response');
  all.push(...rows);
  const pages = Number(res.headers.get('x-pagination-page-count'));
  if (!rows.length || (pages > 0 ? page >= pages : rows.length < 100)) break;
 }
 return all;
}
export async function movies(token: string): Promise<TraktMovie[]> {
 const rows = await paginated<Media & { watched_at: string; watched_count: number }>('/sync/tracking/watched/movies', token);
 return rows.map(row => ({ type: 'movie', movie: normalizeMedia(row), plays: row.watched_count,
  last_watched_at: row.watched_at, last_updated_at: row.watched_at }));
}
export async function shows(token: string): Promise<TraktShow[]> {
 // Episode history includes partly watched, paused and dropped shows as well as finished shows.
 const rows = await paginated<Play>('/sync/tracking/watched/history/episodes', token);
 const grouped = new Map<number, TraktShow>();
 for (const row of rows) {
  const { episode, watched_at } = row;
  let show = grouped.get(episode.show.id);
  if (!show) {
   show = { type: 'show', show: normalizeMedia(episode.show), plays: 0, last_watched_at: watched_at,
    last_updated_at: watched_at, reset_at: '', seasons: [] };
   grouped.set(episode.show.id, show);
  }
  show.plays++;
  if (watched_at > show.last_watched_at) show.last_watched_at = watched_at;
  let season = show.seasons.find(s => s.number === episode.season_number);
  if (!season) { season = { number: episode.season_number, episodes: [] }; show.seasons.push(season); }
  const existing = season.episodes.find(e => e.number === episode.number);
  if (existing) { existing.plays++; if (watched_at > existing.last_watched_at) existing.last_watched_at = watched_at; }
  else season.episodes.push({ number: episode.number, plays: 1, last_watched_at: watched_at });
 }
 return [...grouped.values()];
}
export async function media(type: 'movies' | 'shows', id: string): Promise<TraktItemData> {
 if (!/^\d+$/.test(id)) throw new Error('WeTrakr links require a numeric WeTrakr ID');
 return normalizeMedia(await request('wetrakr', `/${type}/${id}`));
}
export async function search(query = ''): Promise<TraktSearchResult> {
 if (!query.trim()) return [];
 const rows: (Media & { score?: number })[] = await request('wetrakr', '/search?' + new URLSearchParams({ q: query, filter_type: 'media' }));
 return rows.filter(row => row.type === 'movie' || row.type === 'show').map(row => ({
  type: row.type as 'movie' | 'show', score: row.score || 0,
  [row.type!]: normalizeMedia(row)
 }));
}
export async function progress(id: string | number, token: string): Promise<TraktShowHistory> {
 const seasonsData: { id: number; number: number; title?: string }[] = await request('wetrakr', `/shows/${encodeURIComponent(id)}/seasons`, token);
 const seasons = [];
 for (const season of seasonsData) {
  const rows: { number: number; air_date?: string; air_datetime?: string; interactions?: { user?: { tracking?: { last?: { status: string; tracked_at: string } } } } }[] = await request('wetrakr', `/seasons/${season.id}/episodes`, token);
  const episodes = rows.filter(e => {
   const date = e.air_datetime || e.air_date;
   return date && new Date(date).getTime() <= Date.now();
  }).map(e => ({ number: e.number, completed: e.interactions?.user?.tracking?.last?.status === 'watched',
   last_watched_at: e.interactions?.user?.tracking?.last?.status === 'watched' ? e.interactions.user.tracking.last.tracked_at : '' }));
  seasons.push({ number: season.number, title: season.title || null, aired: episodes.length,
   completed: episodes.filter(e => e.completed).length, episodes });
 }
 return { aired: seasons.filter(s => s.number > 0).reduce((n,s) => n+s.aired,0),
  completed: seasons.filter(s => s.number > 0).reduce((n,s) => n+s.completed,0),
  seasons, hidden_seasons: [], last_watched_at: seasons.flatMap(s => s.episodes).map(e => e.last_watched_at).sort().at(-1) || null,
  reset_at: null, next_episode: null, last_episode: null };
}
