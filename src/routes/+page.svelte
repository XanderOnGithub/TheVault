<script>
	import AppGridTile from '../components/Apps/AppGridTile.svelte';
	import AppAddOverlay from '../components/Apps/AppAddOverlay.svelte';
	import { filterApps, loadApps, loadedApps } from '../lib/AppService.js';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let apps = [];
	let targetApps = [];
	let search = '';

	let isOverlayOpen = false;

	function openOverlay() {
		isOverlayOpen = true;
	}

	function closeOverlay() {
		isOverlayOpen = false;
	}

	async function loadAppGrid() {
		await loadApps();
		apps = loadedApps;
		targetApps = apps;
	}

	async function refreshApps() {
		apps = loadedApps;
		targetApps = apps;
		search = '';
	}

	onMount(loadAppGrid);

	function UpdateAppFilter() {
		targetApps = filterApps(apps, search);
	}
</script>

<AppAddOverlay {isOverlayOpen} onClose={closeOverlay} on:appAdded={refreshApps} />

<!-- Search bar -->
<form class="max-w-md mx-auto py-5 flex items-center">
	<label for="default-search" class="mb-2 text-sm font-medium text-zinc-900 sr-only dark:text-white"
		>Search</label
	>
	<div class="relative flex-grow">
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
		<!-- Search Input -->
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
	<!-- Add App Button -->
	<button
		type="button"
		class="ml-2 p-4 bg-blue-500 hover:bg-blue-600 active:bg-blue text-white rounded-lg flex items-center justify-center"
		on:click={openOverlay}
	>
		<svg
			class="w-4 h-4"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path>
		</svg>
	</button>
</form>

<!-- Apps -->
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

<!-- All Needed Styles that aren't in Tailwind go here -->
<style lang="postcss"></style>
