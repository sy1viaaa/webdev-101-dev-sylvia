<script>
	import Login from '$lib/components/Login.svelte';
	import { appName } from '$lib/config';
	import '../app.css';
</script>

<div class="flex h-screen w-screen justify-center">
	<div class="w-full max-w-4xl">
		<div class="navbar bg-base-100">
			<div class="flex-none">
				<button class="btn-ghost btn-square btn">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						class="inline-block h-5 w-5 stroke-current"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						/></svg
					>
				</button>
			</div>
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
