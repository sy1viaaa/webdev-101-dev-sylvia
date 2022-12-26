<script lang="ts">
	import { appName } from '$lib/config';
	import IconAdd from '$lib/icons/IconAdd.svelte';
	import IconLogout from '$lib/icons/IconLogout.svelte';
	import { currentUser, pb } from '$lib/pocketbase';
	import type { ChangeEventHandler } from 'svelte/elements';
	import Textarea from './glue/Textarea.svelte';

	let state: 'signin' | 'register' = 'register';

	const toggleState = () => {
		if (state === 'signin') state = 'register';
		else state = 'signin';
	};

	let email: string;
	let password: string;

	async function login() {
		await pb.collection('users').authWithPassword(email, password);
	}

	async function signUp() {
		try {
			const data = {
				email,
				password,
				passwordConfirm: password
			};
			await pb.collection('users').create(data);
			await login();
		} catch (err) {
			console.error(err);
		}
	}

	function signOut() {
		console.log('sign out');
		pb.authStore.clear();
	}

	const handleSubmit = () => {
		if (state === 'signin') login();
		else if (state === 'register') signUp();
	};

	// create post
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
	<div class="dropdown-end dropdown">
		<label tabindex="0" class="btn-ghost btn">{$currentUser.email?.split('@')[0]}</label>
		<ul
			tabindex="0"
			class="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-200 p-2 shadow"
		>
			<li>
				<label tabindex="0" for="modal-create-post" class="flex items-center">
					<IconAdd />Create post
				</label>
			</li>
			<li><button on:click={signOut}><IconLogout />Logout</button></li>
		</ul>
	</div>

	<!-- create post modal -->
	<input type="checkbox" id="modal-create-post" class="modal-toggle" />
	<label for="modal-create-post" class="modal cursor-pointer">
		<label class="modal-box relative w-11/12 max-w-sm" for="">
			<form on:submit|preventDefault>
				<div class="flex flex-col gap-3">
					<h3 class="p-0 text-xl font-medium">Create post</h3>
					<Textarea label="caption" name="caption" required bind:value={caption} />
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
{:else}
	<button>
		<label for="modal-auth" class="btn-primary btn">Get started</label>
	</button>
	<input type="checkbox" id="modal-auth" class="modal-toggle" />
	<label for="modal-auth" class="modal cursor-pointer">
		<label class="modal-box relative w-11/12 max-w-sm" for="">
			<form on:submit|preventDefault={handleSubmit}>
				<div class="flex flex-col gap-3">
					<h3 class="p-0 text-xl font-medium text-gray-900 dark:text-white">
						{state === 'signin' ? 'Sign in to' : 'Create an account on'}
						{appName}
					</h3>
					<div class="form-control">
						<label class="label" for="email">Email</label>
						<input
							class="input-bordered input w-full max-w-xs"
							type="email"
							name="email"
							placeholder="name@company.com"
							required
							bind:value={email}
						/>
					</div>
					<div class="form-control">
						<label class="label" for="password">Password</label>
						<input
							class="input-bordered input w-full max-w-xs"
							type="password"
							name="password"
							placeholder="••••••••••"
							required
							bind:value={password}
						/>
					</div>
					<div class="flex items-center justify-between">
						<!-- NOTE: remember me checkbox -->
						<!-- <div class="form-control">
							<label class="label cursor-pointer">
								<div class="flex items-center gap-3">
									<input type="checkbox" checked={true} class="checkbox-primary checkbox" />
									<span class="label-text">Remember me</span>
								</div>
							</label>
						</div> -->
						{#if state === 'signin'}
							<div>
								<a href="/" class="ml-auto text-sm text-blue-700 hover:underline dark:text-blue-500"
									>Lost password?</a
								>
							</div>
						{/if}
					</div>
					<button type="submit" class="btn-primary btn-block btn"
						>{state === 'signin' ? 'Sign in' : 'Create account'}</button
					>
					<div class="text-sm font-medium text-gray-500 dark:text-gray-300">
						{state === 'signin' ? 'Not registered?' : 'Already have an account?'}
						<button
							class="text-blue-700 hover:underline dark:text-blue-500"
							on:click={toggleState}
							type="button"
							>{state === 'signin' ? 'Create account' : 'Sign in'}
						</button>
					</div>
				</div>
				<!-- <input placeholder="Username" type="text" bind:value={email} />
				<input placeholder="Password" type="password" bind:value={password} />
				<div class="mt-2 flex items-center gap-2">
					<button class="btn-sm btn" on:click={signUp}>Sign Up</button>
					<button class="btn-sm btn" on:click={login}>Login</button>
				</div> -->
			</form>
		</label>
	</label>
{/if}
