import { PUBLIC_TRAKT_ID } from '$env/static/public';
import { TRAKT_SECRET } from '$env/static/private';

export async function GET({ cookies }) {
  const body = {
    'token': cookies.get('access_token'),
    'client_id': PUBLIC_TRAKT_ID,
    'client_secret': TRAKT_SECRET
  };
  
  const request = await fetch('https://api.trakt.tv/oauth/revoke', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  return new Response('Success');
}