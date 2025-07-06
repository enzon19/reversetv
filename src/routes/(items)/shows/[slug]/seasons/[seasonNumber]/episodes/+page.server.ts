import { redirect } from '@sveltejs/kit';

export async function load({ params }) {
	redirect(303, `/shows/${params.slug}/seasons/${params.seasonNumber}`);
}
