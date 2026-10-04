import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { createHash } from 'node:crypto';
process.env.WETRAKR_CLIENT_ID = 'test-client';
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
const originalFetch = globalThis.fetch;
const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), { status, headers });
function cookies(initial = {}) {
 const values = new Map(Object.entries(initial));
 const options = new Map();
 return { get: key => values.get(key), set: (key, value, config) => { values.set(key, value); options.set(key, config); }, delete: key => values.delete(key), options };
}
try {
 const provider = await server.ssrLoadModule('/src/lib/server/providers.ts');
 const adapter = await server.ssrLoadModule('/src/lib/server/wetrakr.ts');
 const login = await server.ssrLoadModule('/src/routes/login/[provider]/+server.ts');
 const callback = await server.ssrLoadModule('/src/lib/server/authorize.ts');
 const layout = await server.ssrLoadModule('/src/routes/+layout.server.ts');
 const logout = await server.ssrLoadModule('/src/routes/out/sign/+server.ts');
 assert.equal(provider.providerFor(cookies({ access_token: 'legacy' })), 'trakt');
 await provider.tokens('trakt', { refresh_token: 'trakt-refresh' }, async (url, options) => {
  assert.equal(url, 'https://api.trakt.tv/oauth/token');
  assert.equal(options.headers['trakt-api-version'], '2');
  assert.equal(options.headers['wetrakr-api-key'], undefined);
  assert.equal(JSON.parse(options.body).grant_type, 'refresh_token');
  return json({ access_token: 'trakt-access', refresh_token: 'trakt-next', expires_in: 604800 });
 });

 const session = cookies();
 let destination;
 try { await login.GET({ params: { provider: 'wetrakr' }, cookies: session }); } catch (redirect) { assert.equal(redirect.status, 303); destination = new URL(redirect.location); }
 assert.equal(destination.origin, 'https://api.wetrakr.com');
 assert.equal(destination.searchParams.get('state'), session.get('oauth_state'));
 assert.equal(destination.searchParams.get('code_challenge'), createHash('sha256').update(session.get('oauth_verifier')).digest('base64url'));
 assert.equal(destination.searchParams.get('code_challenge_method'), 'S256');
 let called = false;
 const bad = await callback.authorize('wetrakr', new URL('https://example.com?code=x&state=wrong'), cookies({ oauth_state: 'expected', oauth_provider: 'wetrakr' }), async () => { called = true; });
 assert.ok(bad.error); assert.equal(called, false);
 const state = session.get('oauth_state');
 try {
  await callback.authorize('wetrakr', new URL('https://example.com?code=x&state=' + state), session, async (url, options) => {
   assert.equal(JSON.parse(options.body).client_id, 'test-client');
   assert.ok(JSON.parse(options.body).code_verifier);
   assert.equal(options.headers['wetrakr-api-version'], '1');
   assert.equal(options.headers['trakt-api-key'], undefined);
   return json({ access_token: 'new-access', refresh_token: 'new-refresh', expires_in: 604800 });
  });
 } catch (redirect) { assert.equal(redirect.status, 303); }
 assert.equal(session.get('provider'), 'wetrakr');
 assert.equal(session.options.get('refresh_token').maxAge, 86400 * 180);
 assert.equal(session.options.get('access_token').httpOnly, true);
 let pageCalls = 0;
 globalThis.fetch = async (url, options) => {
  assert.equal(options.headers.Authorization, 'Bearer private-token');
  const page = Number(new URL(url).searchParams.get('page'));
  pageCalls++;
  return json([{ id: page }], 200, { 'x-pagination-page-count': '2' });
 };
 assert.equal((await adapter.paginated('/sync/tracking/watched/movies', 'private-token')).length, 2);
 assert.equal(pageCalls, 2);
 const show = { id: 42, title: 'Partly watched', ids: { tmdb: 100 } };
 globalThis.fetch = async () => json([
  { watched_at: '2026-09-02T00:00:00Z', episode: { season_number: 1, number: 1, show } },
  { watched_at: '2026-09-01T00:00:00Z', episode: { season_number: 1, number: 1, show } }
 ]);
 const history = await adapter.shows('private-token');
 assert.equal(history.length, 1); assert.equal(history[0].show.ids.slug, '42');
 assert.equal(history[0].seasons[0].episodes[0].plays, 2);
 assert.equal(history[0].last_watched_at, '2026-09-02T00:00:00Z');
 globalThis.fetch = async url => String(url).includes('/shows/') ? json([{ id: 7, number: 1 }]) : json([
  { number: 1, air_date: '2020-01-01', interactions: { user: { tracking: { last: { status: 'watched', tracked_at: '2026-01-01' } } } } },
  { number: 2, air_date: '2020-01-02' }, { number: 3, air_date: '2099-01-01' }
 ]);
 const progress = await adapter.progress(42, 'private-token');
 assert.equal(progress.aired, 2); assert.equal(progress.completed, 1);
 const refreshed = cookies({ provider: 'wetrakr', access_token: 'expired', refresh_token: 'old-refresh' });
 const refreshedData = await layout.load({ cookies: refreshed, fetch: async (url, options) => {
  if (String(url).endsWith('/oauth/token/refresh')) {
   assert.deepEqual(JSON.parse(options.body), { refresh_token: 'old-refresh' });
   return json({ access_token: 'rotated', refresh_token: 'rotated-refresh', expires_in: 604800 });
  }
  if (options.headers.Authorization === 'Bearer expired') return json({}, 401);
  return json({ info: { username: 'viewer' }, images: {} });
 } });
 assert.equal(refreshedData.user.username, 'viewer');
 assert.equal(refreshed.get('refresh_token'), 'rotated-refresh');
 const outage = cookies({ provider: 'wetrakr', access_token: 'valid', refresh_token: 'keep' });
 await assert.rejects(layout.load({ cookies: outage, fetch: async () => json({}, 503) }));
 assert.equal(outage.get('refresh_token'), 'keep');
 await logout.POST({ cookies: refreshed, fetch: async () => { throw new Error('offline'); } });
 assert.equal(refreshed.get('access_token'), undefined); assert.equal(refreshed.get('provider'), undefined);
 console.log('Passed: PKCE, state validation, provider isolation, cookie lifetime, pagination, partial shows, progress, refresh rotation, outage handling and logout.');
} finally { globalThis.fetch = originalFetch; await server.close(); }
