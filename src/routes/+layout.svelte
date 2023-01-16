<script>
	import Login from '$lib/components/Login.svelte';
	import { appName } from '$lib/config';
	import '../app.css';
</script>

<div class="flex h-screen w-screen justify-center">
	<div class="w-full max-w-4xl">
		<div class="navbar bg-base-100">
			<div class="flex-1">
				<button>
					<a class="btn-ghost btn text-xl normal-case">{appName}</a>
				</button>
			</div>
			<div class="flex-none">
				<Login />
			</div>
		</div>
		<slot />
	</div>
</div>
