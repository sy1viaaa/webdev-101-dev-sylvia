<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { currentUser, pb } from '$lib/pocketbase';
	let newMessage: string;
	let messages: any[] = [];
	let unsubscribe: () => void;
	onMount(async () => {
		// Get initial messages
		const resultList = await pb.collection('messages').getList(1, 50, {
			sort: 'created',
			expand: 'user'
		});
		messages = resultList.items;
		// Subscribe to realtime messages
		unsubscribe = await pb.collection('messages').subscribe('*', async ({ action, record }) => {
			if (action === 'create') {
				// Fetch associated user
				const user = await pb.collection('users').getOne(record.user);
				record.expand = { user };
				messages = [...messages, record];
			}
			if (action === 'delete') {
				messages = messages.filter((m) => m.id !== record.id);
			}
		});
	});

	// Unsubscribe from realtime messages
	onDestroy(() => {
		unsubscribe?.();
	});

	async function sendMessage() {
		const data = {
			text: newMessage,
			user: $currentUser?.id
		};
		const createdMessage = await pb.collection('messages').create(data);
		newMessage = '';
	}
</script>

<div class="messages">
	{#each messages as message (message.id)}
		<div class="msg py-2">
			<div class="flex items-center gap-x-2">
				<div class="avatar">
					<div class="w-4 rounded-full">
						<img
							src={`https://avatars.dicebear.com/api/identicon/${message.expand?.user?.username}.svg`}
							alt="avatar"
							width="40px"
						/>
					</div>
				</div>
				<p class="text-sm font-medium">{message.expand?.user?.username}</p>
			</div>
			<div>
				<p class="msg-text">{message.text}</p>
			</div>
		</div>
	{/each}
</div>
<div class="mt-2">
	<form on:submit|preventDefault={sendMessage}>
		<div class="flex items-center">
			<input
				class="input-bordered input flex-grow"
				placeholder="Message"
				type="text"
				bind:value={newMessage}
			/>
			<button class="btn-primary btn ml-2" type="submit">Send</button>
		</div>
	</form>
</div>
