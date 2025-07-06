import { redirect } from '@sveltejs/kit';

export async function load({ cookies, parent }) {
	const { user } = await parent();
	if (!user) redirect(303, '/');

	return {
		acc: cookies.get('access_token')
	};
}
