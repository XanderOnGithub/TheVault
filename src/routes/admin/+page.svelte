<script>
	// Import necessary modules and components
	import { onMount, onDestroy } from 'svelte';
	import AdminNav from '../../components/apps/admin/AdminNav.svelte';
	import VaultFooter from '../../components/vaultFooter.svelte';
	import { writable } from 'svelte/store';
	import { fetchAppRequests } from '$lib/firebase/firestoreService';
	import { user } from '../../lib/firebase/authService';
	import AdminAppCard from '../../components/apps/admin/AdminAppCard.svelte'; // Default import

	// Initialize state variables
	const apps = writable([]);

	let currentUser = null;

	// Subscribe to the user store to get the current user
	const unsubscribe = user.subscribe((value) => {
		currentUser = value;
	});

	// Cleanup subscription on component destroy
	onDestroy(() => {
		unsubscribe();
	});

	// Fetch app requests on component mount
	onMount(async () => {
		const appRequests = await fetchAppRequests();
		apps.set(appRequests);
		console.log(appRequests);
	});
</script>

<!-- Navigation Component -->
<AdminNav {currentUser} />

<main class="p-8 bg-white dark:bg-black text-black dark:text-white min-h-screen">
	{#if currentUser && currentUser.role >= 2}
		<div class="flex justify-between items-center mb-8">
			<h1 class="text-3xl font-bold">Administrator Access</h1>
		</div>

		<!-- Display the list of filtered apps or a message if no apps are found -->
		{#if $apps.length > 0}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-6">
				{#each $apps as app}
					<AdminAppCard {app} />
				{/each}
			</div>
		{:else}
			<p>No app requests.</p>
		{/if}
	{:else}
		<div class="flex justify-center items-center h-screen">
			<h1 class="text-3xl font-bold">NO ACCESS</h1>
		</div>
	{/if}
</main>

<!-- Footer Component -->
<VaultFooter />
