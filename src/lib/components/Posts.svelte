<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { currentUser, pb } from '$lib/pocketbase';
	import { format } from 'date-fns';

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
	<div class="w-full max-w-lg p-4">
		{#each posts as post}
			<div class="mb-4 flex flex-col gap-2 rounded-lg border-2 border-base-300 py-2">
				<!-- author -->
				<div class="flex justify-between py-2 px-4">
					<div class="flex items-center gap-2">
						<!-- avatar -->
						<div class="placeholder avatar">
							<div class="w-8 rounded-full bg-neutral-focus text-neutral-content">
								<span class="text-md">{post?.expand?.user?.username?.charAt(0)}</span>
							</div>
						</div>

						<!-- username -->
						<p class="text-sm font-medium">{post?.expand?.user?.username}</p>
					</div>
				</div>
				<!-- photo -->
				<div class="carousel w-full">
					{#each post.photos as photo, idx (photo)}
						<div id={`${idx}`} class="carousel-item relative w-full">
							<img src={pb.getFileUrl(post, photo, { thumb: '100x250' })} class="w-full" />
							<div
								class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between"
							>
								<a href={`#${Math.max(0, idx - 1)}`} class="btn-ghost btn-circle btn">❮</a>
								<a
									href={`#${Math.min(post?.photos?.length - 1, idx + 1)}`}
									class="btn-ghost btn-circle btn">❯</a
								>
							</div>
						</div>
					{/each}
				</div>

				<div class="py-2 px-4">
					<!-- caption -->
					<p class="mb-4 text-sm">{post.caption}</p>

					<!-- date -->
					<p class="text-xs">{format(new Date(post.created), 'MMM dd yyyy')}</p>
				</div>
			</div>
		{/each}
	</div>
</div>
