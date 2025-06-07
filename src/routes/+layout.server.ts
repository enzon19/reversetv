import { PUBLIC_TRAKT_ID } from '$env/static/public';

export async function load({cookies}) {
  let user;
  
  try {
    const request = await fetch('https://api.trakt.tv/users/settings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + cookies.get('access_token'),
        'trakt-api-version': '2',
        'trakt-api-key': PUBLIC_TRAKT_ID
      }
    });
    
    const data = await request.json();
    user = data;
  } catch (e) {}

  return {user};
}