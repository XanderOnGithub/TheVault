<script>
	// Import necessary modules and components
	import { onMount, onDestroy } from 'svelte';
	import AppCard from '../../components/apps/AppCard.svelte';
	import NewAppModal from '../../components/apps/NewAppModal.svelte';
	import AppNav from '../../components/apps/AppNav.svelte';
	import VaultFooter from '../../components/vaultFooter.svelte';
	import { writable, derived } from 'svelte/store';
	import { fetchApps, fetchTags, fetchPlatforms } from '$lib/firebase/firestoreService';
	import { user } from '../../lib/firebase/authService'; // Import the user store

	// Initialize state variables
	let searchQuery = writable('');
	let selectedTags = writable([]); // Store for selected tags
	let selectedPlatform = writable(''); // Store for selected platform
	let sortBy = writable('Newest'); // Store for sort by criteria
	const apps = writable([]);
	let showModal = false;
	const tagOptions = writable([]);
	const platformOptions = writable([]); // Store for platform options
	let currentUser = null;

	// Subscribe to the user store to get the current user
	const unsubscribe = user.subscribe((value) => {
		currentUser = value;
	});

	// Cleanup subscription on component destroy
	onDestroy(() => {
		unsubscribe();
	});

	/**
	 * Convert a string to title case.
	 * @param {string} str - The string to convert.
	 * @returns {string} - The converted string in title case.
	 */
	function toTitleCase(str) {
		return str.replace(/\w\S*/g, function (txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	}

	/**
	 * Fetch the available tag options, platform options, and app list.
	 */
	const initializeData = async () => {
		try {
			const [tags, platforms, appList] = await Promise.all([
				fetchTags(),
				fetchPlatforms(),
				fetchApps(selectedTags)
			]);
			tagOptions.set(tags);
			platformOptions.set(platforms.sort()); // Sort platforms alphabetically
			apps.set(appList);
		} catch (error) {
			console.error('Error initializing data:', error);
		}
	};

	/**
	 * Event handler for search input.
	 * @param {Event} event - The input event.
	 */
	const handleSearch = (event) => {
		searchQuery.set(event.target.value);
	};

	/**
	 * Event handler for platform selection.
	 * @param {Event} event - The change event.
	 */
	const handlePlatformChange = (event) => {
		selectedPlatform.set(event.target.value);
	};

	/**
	 * Event handler for sort by selection.
	 * @param {Event} event - The change event.
	 */
	const handleSortByChange = (event) => {
		sortBy.set(event.target.value);
	};

	/**
	 * Event handler for tag selection.
	 * @param {Event} event - The change event.
	 */
	const handleTagChange = (event) => {
		selectedTags.set(Array.from(event.target.selectedOptions, (option) => option.value));
	};

	/**
	 * Event handler for deselecting all tags.
	 */
	const handleDeselectAllTags = () => {
		selectedTags.set([]);
	};

	const openModal = () => {
		showModal = true;
	};

	const closeModal = () => {
		showModal = false;
	};

	/**
	 * Event handler for adding a new app.
	 */
	const handleAppAdded = () => {
		closeModal();
	};

	onMount(() => {
		initializeData();
	});

	/**
	 * Parse Firestore Timestamp to JavaScript Date.
	 * @param {Object} timestamp - The Firestore Timestamp object.
	 * @param {number} timestamp.seconds - The seconds part of the timestamp.
	 * @param {number} timestamp.nanoseconds - The nanoseconds part of the timestamp.
	 * @returns {Date} - The parsed JavaScript Date object.
	 */
	function parseDate(timestamp) {
		if (timestamp && timestamp.seconds !== undefined) {
			return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
		}
		return new Date(NaN);
	}

	// Derived store to filter and sort apps based on the search query, selected platform, selected tags, and sort criteria
	const filteredApps = derived(
		[apps, searchQuery, selectedPlatform, selectedTags, sortBy],
		([$apps, $searchQuery, $selectedPlatform, $selectedTags, $sortBy]) => {
			const searchQueryLower = $searchQuery.toLowerCase();
			const selectedPlatformLower = $selectedPlatform.toLowerCase();

			let filtered = $apps.filter((app) => {
				const matchesSearchQuery =
					!$searchQuery || app.name.toLowerCase().includes(searchQueryLower);
				const matchesPlatform =
					!$selectedPlatform || Object.keys(app.platforms).includes(selectedPlatformLower);
				const matchesTags =
					!$selectedTags.length || $selectedTags.every((tag) => app.tags.includes(tag));
				return matchesSearchQuery && matchesPlatform && matchesTags;
			});

			// Sort the filtered apps based on the selected sort criteria
			switch ($sortBy) {
				case 'Newest':
					filtered.sort((a, b) => {
						const dateA = parseDate(a.createdAt);
						const dateB = parseDate(b.createdAt);
						return dateB - dateA;
					});
					break;
				case 'Oldest':
					filtered.sort((a, b) => {
						const dateA = parseDate(a.createdAt);
						const dateB = parseDate(b.createdAt);
						return dateA - dateB;
					});
					break;
				case 'Name A -> Z':
					filtered.sort((a, b) => a.name.localeCompare(b.name));
					break;
				case 'Name Z -> A':
					filtered.sort((a, b) => b.name.localeCompare(a.name));
					break;
				case 'Price Increasing':
					filtered.sort((a, b) => a.price - b.price);
					break;
				case 'Price Decreasing':
					filtered.sort((a, b) => b.price - a.price);
					break;
			}

			return filtered;
		}
	);
</script>

<!-- Navigation Component -->
<AppNav {currentUser} />
<main class="p-8 bg-white dark:bg-black text-black dark:text-white min-h-screen">
	<div class="flex flex-col sm:flex-row mx-auto mb-4 w-full px-6 items-center">
		<!-- Grouped Sort By and Platform Dropdowns -->
		<div class="flex flex-col sm:flex-row items-center">
			<!-- Search Bar -->
			<input
				type="text"
				placeholder="Search apps..."
				class="sm:mr-2 my-1 sm:my-0 mx-auto px-2 py-2 rounded-md border border-gray-300 bg-white dark:bg-black dark:text-white w-48 h-10"
				on:input={handleSearch}
			/>

			<!-- Sort By Dropdown -->
			<select
				class="mx-auto my-1 sm:my-0 px-2 py-2 rounded-md border border-gray-300 bg-white dark:bg-black dark:text-white w-48 h-10"
				on:change={handleSortByChange}
			>
				<option value="Newest">Newest -> Oldest</option>
				<option value="Oldest">Oldest -> Newest</option>
				<option value="Name A -> Z">Name A -> Z</option>
				<option value="Name Z -> A">Name Z -> A</option>
				<option value="Price Increasing">Price Increasing</option>
				<option value="Price Decreasing">Price Decreasing</option>
			</select>
			<!-- Platform Dropdown -->
			<select
				class="mx-auto my-1 sm:my-0 sm:ml-2 px-2 py-2 rounded-md border border-gray-300 bg-white dark:bg-black dark:text-white w-48 h-10"
				on:change={handlePlatformChange}
			>
				<option value="">All Platforms</option>
				{#each $platformOptions as platform}
					<option value={platform}>{platform}</option>
				{/each}
			</select>
		</div>
		<!-- Tag Dropdown -->
		<div class="flex items-center">
			<select
				class="mx-auto my-1 sm:my-0 sm:ml-2 px-2 py-2 rounded-md border border-gray-300 bg-white dark:bg-black dark:text-white w-48 h-20"
				multiple
				on:change={handleTagChange}
			>
				{#each $tagOptions as tag}
					<option value={tag}>{tag}</option>
				{/each}
			</select>
			<!-- Deselect All Button -->
			<button
				class="ml-2 px-2 py-2 rounded-md border border-gray-300 bg-white dark:bg-black dark:text-white h-10"
				on:click={handleDeselectAllTags}
			>
				Deselect All
			</button>
		</div>
	</div>
	{#if currentUser !== null}
		<div class="flex justify-end mb-4">
			<!-- Button to open the modal for adding a new app -->
			<button class="btn btn-primary flex items-center" on:click={() => openModal()}>
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
</main>
<!-- Footer Component -->
<VaultFooter />
{#if showModal}
	<NewAppModal on:close={closeModal} on:appadded={handleAppAdded} />
{/if}
