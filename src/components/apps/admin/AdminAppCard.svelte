<script>
	import AppCardTag from '../../apps/card/AppCardTag.svelte';
	import { handleAppRequest } from '../../../lib/firebase/firestoreService';
	export let app;

	// Function to get all App platform keys
	function getPlatformKeys(platforms) {
		return Object.keys(platforms).sort();
	}

	// Function to convert string to title case
	function toTitleCase(str) {
		return str.replace(/\w\S*/g, function (txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	}

	// Function to handle app request
	async function handleRequest(action) {
		await handleAppRequest(app.id, action);
	}
</script>

<div class="bg-white dark:bg-black border border-gray-300 px-3 py-6 rounded-md">
	<div class="card-body">
		<h2 class="card-title text-3xl font-extrabold mb-4 text-accent">
			{app.name}
		</h2>
		<p class="text-base-content mb-4">{app.description}</p>
		<p class="text-sm text-base-content mb-2">
			Organization: <span class="text-gray-400">{app.organization}</span>
		</p>
		<p class="text-sm text-base-content flex flex-row w-fit my-4">
			<span class="mr-3">Tags: </span>
			{#each app.tags.sort() as tag}
				<p class="mr-3">{toTitleCase(tag)}</p>
			{/each}
		</p>

		<p class="text-sm text-base-content flex flex-row w-fit my-4">
			{#each getPlatformKeys(app.platforms) as key}
				<AppCardTag tag={key} />
			{/each}
		</p>

		<p class="mb-6 text-gray-400 responsive-line"></p>

		<div class="flex justify-between items-center">
			<p class="text-lg mono text-gray-400">
				${app.price}
			</p>
			<div class="flex flex-row space-x-3">
				<button class="btn btn-primary" on:click={() => handleRequest(true)}>Accept</button>
				<button class="btn btn-secondary" on:click={() => handleRequest(false)}>Remove</button>
			</div>
		</div>
	</div>
</div>
