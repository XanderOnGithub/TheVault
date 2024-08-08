<script>
	// Import necessary modules and components
	import { onMount, onDestroy } from 'svelte';
	import AppCard from '../../components/apps/AppCard.svelte';
	import NewAppModal from '../../components/apps/NewAppModal.svelte';
	import AppNav from '../../components/apps/AppNav.svelte';
	import VaultFooter from '../../components/vaultFooter.svelte';
	import { writable, derived } from 'svelte/store';
	import { fetchApps, fetchTags } from '$lib/firebase/firestoreService';
	import { user } from '../../lib/firebase/authService'; // Import the user store

	// Initialize state variables
	let searchQuery = writable('');
	let selectedTags = [];
	const apps = writable([]);
	const showModal = writable(false);
	const tagOptions = writable([]);

	let currentUser = null;

	// Subscribe to the user store to get the current user
	const unsubscribe = user.subscribe((value) => {
		currentUser = value;
	});

	// Cleanup subscription on component destroy
	onDestroy(() => {
		unsubscribe();
	});

	// Function to fetch the available tag options and app list
	const initializeData = async () => {
		try {
			const [tags, appList] = await Promise.all([fetchTags(), fetchApps(selectedTags)]);
			tagOptions.set(tags);
			apps.set(appList);
		} catch (error) {
			console.error('Error initializing data:', error);
		}
	};

	// Fetch tag options and app list on component mount
	onMount(initializeData);

	// Derived store to filter apps based on the search query
	const filteredApps = derived([apps, searchQuery], ([$apps, $searchQuery]) =>
		$apps.filter((app) => app.name.toLowerCase().includes($searchQuery.toLowerCase()))
	);

	// Event handler for search input
	const handleSearch = (event) => {
		searchQuery.set(event.target.value);
	};

	// Event handler for adding a new app
	const handleAppAdded = () => {
		showModal.set(false);
	};
</script>

<!-- Navigation Component -->
<AppNav {currentUser} />

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

	{#if currentUser !== null}
		<div class="flex justify-end mb-4">
			<!-- Button to open the modal for adding a new app -->
			<button class="btn btn-primary flex items-center" on:click={() => showModal.set(true)}>
				<!-- Add icon -->
				<span class="mr-2">+</span>
				Request App
			</button>
		</div>
	{/if}

	<!-- Display the list of filtered apps or a message if no apps are found -->
	{#if $filteredApps.length > 0}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-6">
			{#each $filteredApps as app}
				<AppCard {app} />
			{/each}
		</div>
	{:else}
		<p>No apps found.</p>
	{/if}

	<!-- Modal for adding a new app -->
	{#if $showModal}
		<NewAppModal on:close={() => showModal.set(false)} on:appadded={handleAppAdded} />
	{/if}
</main>

<!-- Footer Component -->
<VaultFooter />
