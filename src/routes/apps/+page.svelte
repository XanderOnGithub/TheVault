<script>
	// Import necessary modules and components
	import { onMount } from 'svelte';
	import AppList from '../../components/apps/AppList.svelte';
	import NewAppModal from '../../components/apps/NewAppModal.svelte';
	import AppNav from '../../components/apps/AppNav.svelte';
	import ThemeToggle from '../../components/themeToggle.svelte';
	import { writable, derived } from 'svelte/store';
	import { fetchApps, fetchTags } from '$lib/firebase/firestoreService';

	// Initialize state variables
	let searchQuery = '';
	let selectedTags = [];
	const apps = writable([]);
	const showModal = writable(false);
	const tagOptions = writable([]);

	// Function to fetch the list of apps based on selected tags
	const fetchAppList = async () => {
		console.log('Fetching apps with tags:', selectedTags);
		const appList = await fetchApps(selectedTags);
		console.log('Fetched apps:', appList);
		apps.set(appList);
	};

	// Function to fetch the available tag options
	const fetchTagOptions = async () => {
		const tags = await fetchTags();
		tagOptions.set(tags);
	};

	// Fetch tag options and app list on component mount
	onMount(async () => {
		await fetchTagOptions();
		await fetchAppList();
	});

	// Derived store to filter apps based on the search query
	const filteredApps = derived(apps, ($apps) => {
		const filtered = $apps.filter((app) => {
			return app.name.toLowerCase().includes(searchQuery.toLowerCase());
		});
		console.log('Filtered apps:', filtered);
		return filtered;
	});

	// Event handler for search input
	const handleSearch = (event) => {
		searchQuery = event.target.value;
	};

	// Event handler for tag change
	const handleTagChange = async (event) => {
		selectedTags = event.detail;
		await fetchAppList();
	};

	// Event handler for adding a new app
	const handleAppAdded = (event) => {
		apps.update((currentApps) => [event.detail, ...currentApps]);
		showModal.set(false);
	};
</script>

<!-- Navigation Component -->
<AppNav />

<main class="p-8 bg-white dark:bg-black text-black dark:text-white min-h-screen">
	<div class="flex mb-4 w-full px-6 justify-center">
		<!-- Search Bar -->
		<input
			type="text"
			placeholder="Search apps..."
			class="px-2 py-2 rounded-md border border-gray-300 bg-white dark:bg-black dark:text-white"
			on:input={handleSearch}
		/>
	</div>

	<div class="flex justify-end mb-4">
		<!-- Button to open the modal for adding a new app -->
		<button class="btn btn-primary" on:click={() => showModal.set(true)}>Add New App</button>
	</div>

	<!-- Display the list of filtered apps or a message if no apps are found -->
	{#if $filteredApps.length > 0}
		<AppList apps={$filteredApps} />
	{:else}
		<p>No apps found.</p>
	{/if}

	<!-- Modal for adding a new app -->
	{#if $showModal}
		<NewAppModal on:close={() => showModal.set(false)} on:appadded={handleAppAdded} />
	{/if}
</main>

<!-- Footer with theme toggle and copyright -->
<footer
	class="py-6 border-t border-dashed bg-white dark:bg-black border-black dark:border-white flex justify-between px-5"
>
	<p class="text-center text-gray-400">
		☻ {new Date().getFullYear()} The Vault. No rights reserved.
	</p>

	<!-- Theme Toggler -->
	<ThemeToggle />
</footer>
