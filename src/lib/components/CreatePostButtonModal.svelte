<script lang="ts">
	import IconAdd from '$lib/icons/IconAdd.svelte';
	import { currentUser, pb } from '$lib/pocketbase';

	const formData = new FormData();
	let caption: string = '';

	const handleCreatePost = async () => {
		formData.append('caption', caption);
		formData.append('user', $currentUser?.id as string);
		await pb.collection('posts').create(formData);
		caption = '';
	};

	const handleFileChange = (event: any) => {
		for (let file of event?.target?.files) {
			formData.append('photos', file);
		}
	};
</script>

{#if $currentUser}
	<div class="flex justify-center">
		<label tabindex="0" for="modal-create-post" class="btn-primary btn gap-2">
			<IconAdd />Create post
		</label>
	</div>
{/if}

<!-- create post modal -->
<input type="checkbox" id="modal-create-post" class="modal-toggle" />
<label for="modal-create-post" class="modal cursor-pointer">
	<label class="modal-box relative w-11/12 max-w-sm" for="">
		<form on:submit|preventDefault>
			<div class="flex flex-col gap-3">
				<h3 class="p-0 text-xl font-medium">Create post</h3>
				<div class="form-control">
					<label class="label" for="caption">Caption</label>
					<textarea
						name="caption"
						class="textarea-bordered textarea h-24 w-full"
						bind:value={caption}
					/>
				</div>
				<input
					type="file"
					class="file-input-bordered file-input w-full max-w-xs"
					on:change={handleFileChange}
					multiple
				/>
				<label
					for="modal-create-post"
					class="btn-primary btn-block btn"
					on:click={handleCreatePost}
				>
					Create post
				</label>
			</div>
		</form>
	</label>
</label>
