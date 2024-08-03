<script>
	import { onMount } from 'svelte';
	import AppList from '../../components/apps/AppList.svelte';
	import NewAppModal from '../../components/apps/NewAppModal.svelte';
	import AppNav from '../../components/apps/AppNav.svelte';
	import { writable, derived } from 'svelte/store';
	import { fetchApps } from '$lib/firebase/firestoreService';
	import ThemeToggle from '../../components/ThemeToggle.svelte';

	let searchQuery = '';
	let selectedTag = '';
	const apps = writable([]);
	const showModal = writable(false);

	const fetchAppList = async () => {
		const appList = await fetchApps(selectedTag);
		apps.set(appList);
	};

	onMount(fetchAppList);

	const filteredApps = derived(apps, ($apps) =>
		$apps.filter((app) => {
			return app.name.toLowerCase().includes(searchQuery.toLowerCase());
		})
	);

	const handleSearch = (event) => {
		searchQuery = event.target.value;
	};

	const handleTagChange = async (event) => {
		selectedTag = event.target.value;
		await fetchAppList();
	};

	const handleAppAdded = (event) => {
		apps.update((currentApps) => [event.detail, ...currentApps]);
		showModal.set(false);
	};
</script>

<AppNav />
<main class="p-8 bg-white dark:bg-black text-black dark:text-white min-h-screen">
	<div class="flex mb-4">
		<input
			type="text"
			placeholder="Search apps..."
			class="input input-bordered w-full mr-2"
			on:input={handleSearch}
		/>
		<select class="select select-bordered" on:change={handleTagChange}>
			<option value="">All Tags</option>
			<option value="tag1">Tag 1</option>
			<option value="tag2">Tag 2</option>
		</select>
	</div>

	<div class="flex justify-end mb-4">
		<button class="btn btn-primary" on:click={() => showModal.set(true)}>Add New App</button>
	</div>

	{#if $filteredApps.length > 0}
		<AppList apps={$filteredApps} />
	{:else}
		<p>No apps found.</p>
	{/if}

	{#if $showModal}
		<NewAppModal on:close={() => showModal.set(false)} on:appadded={handleAppAdded} />
	{/if}
</main>

<footer
	class=" py-6 border-t border-dashed bg-white dark:bg-black border-black dark:border-white flex justify-between px-5"
>
	<p class="text-center text-gray-400">
		☻ {new Date().getFullYear()} The Vault. No rights reserved.
	</p>

	<!-- Theme Toggler -->
	<ThemeToggle />
</footer>
