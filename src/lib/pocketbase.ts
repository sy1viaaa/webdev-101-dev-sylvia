import PocketBase from 'pocketbase';

import { writable } from 'svelte/store';

export const pb = new PocketBase('enter your pocketbase url here');
export const currentUser = writable(pb.authStore.model);

pb.authStore.onChange((auth) => {
	currentUser.set(pb.authStore.model);
});
