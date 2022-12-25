<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { currentUser, pb } from '$lib/pocketbase';

	let posts: any[] = [];
	let unsubscribe: () => void;

	onMount(async () => {
		// Get initial posts
		const resultList = await pb.collection('posts').getList(1, 50, {
			sort: '-created',
			expand: 'user'
		});
		posts = resultList.items;

		// Subscribe to realtime posts
		unsubscribe = await pb.collection('posts').subscribe('*', async ({ action, record }) => {
			if (action === 'create') {
				// Fetch associated user
				const user = await pb.collection('users').getOne(record.user);
				record.expand = { user };
				posts = [record, ...posts];
			}
			if (action === 'delete') {
				posts = posts.filter((m) => m.id !== record.id);
			}
		});
	});

	onDestroy(() => {
		unsubscribe?.();
	});
</script>

<div class="flex justify-center">
	<div class="w-full max-w-lg">
		{#each posts as post}
			<div class="mb-4 flex flex-col gap-2 rounded-lg border-2 border-base-300">
				<!-- author -->
				<div class="flex justify-between py-2 px-4">
					<div class="flex items-center gap-2">
						<!-- avatar -->
						<div class="placeholder avatar">
							<div class="w-8 rounded-full bg-neutral-focus text-neutral-content">
								<span class="text-md">{$currentUser?.email?.charAt(0)}</span>
							</div>
						</div>

						<!-- username -->
						<p class="text-sm font-medium">{$currentUser?.email}</p>
					</div>
				</div>
				<!-- caption -->
				<div class="py-2 px-4">
					<p class="text-sm">{post.caption}</p>
				</div>
			</div>
		{/each}
	</div>
</div>
