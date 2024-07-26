<script>
	import AppGridTile from '../components/Apps/AppGridTile.svelte';

	import { filterApps, loadApps } from '../lib/AppService.js';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let apps = [];
	let targetApps = [];
	let search = '';

	onMount(async () => {
		apps = await loadApps();
		apps.data;
		targetApps = apps;
	});

	function UpdateAppFilter() {
		targetApps = filterApps(apps, search);
	}
</script>

<!-- Search bar -->
<form class="max-w-md mx-auto py-5">
	<label for="default-search" class="mb-2 text-sm font-medium text-zinc-900 sr-only dark:text-white"
		>Search</label
	>
	<div class="relative">
		<div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
			<svg
				class="w-4 h-4 text-zinc-500 dark:text-zinc-400"
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 20 20"
			>
				<path
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
				/>
			</svg>
		</div>
		<input
			type="search"
			id="default-search"
			class="block w-full p-4 ps-10 text-sm text-zinc-900 border border-zinc-300 rounded-lg bg-zinc-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
			placeholder="Search apps..."
			autocomplete="off"
			bind:value={search}
			on:input={UpdateAppFilter}
		/>
	</div>
</form>

<main class=" m-5 p-5 flex justify-center">
	<!-- Item Grid -->
	<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-10">
		{#each targetApps as app (app.id)}
			<div in:fade={{ duration: 100 }}>
				<!-- Applying the fade transition -->
				<AppGridTile {app} />
			</div>
		{/each}
	</div>
</main>

<style lang="postcss"></style>
