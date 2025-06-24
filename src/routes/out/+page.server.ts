import { redirect, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ parent }) => {
	const { user } = await parent();
	if (user) redirect(302, '/');
	return {};
};
