<script>
	import { createEventDispatcher } from 'svelte';
	import { addApp } from '$lib/firebase/firestoreService';

	let name = '';
	let description = '';
	let organization = '';
	let price = '';
	let tags = '';
	const dispatch = createEventDispatcher();

	const handleAddApp = async () => {
		if (name && description && organization && price && tags) {
			const tagsArray = tags.split(',').map((tag) => tag.trim());
			const newApp = await addApp(
				name,
				description,
				organization,
				price === '0.00' ? 'Free' : price,
				tagsArray
			);
			dispatch('appadded', newApp);
		}
	};
</script>

<div class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
	<div
		class="bg-white dark:bg-black border border-gray-300 px-6 py-6 rounded-md shadow-lg max-w-md w-full"
	>
		<h2 class="text-2xl font-bold mb-4 text-accent">Add New App</h2>
		<div class="mb-4">
			<label for="app-name" class="block text-gray-700 dark:text-gray-300">App Name</label>
			<input
				type="text"
				class="border rounded-md px-3 w-full bg-white dark:bg-black dark:text-white border-gray-300"
				bind:value={name}
				id="app-name"
			/>
		</div>
		<div class="mb-4">
			<label for="app-description" class="block text-gray-700 dark:text-gray-300">Description</label
			>
			<textarea
				class="border rounded-md px-3 w-full bg-white dark:bg-black dark:text-white border-gray-300"
				bind:value={description}
				id="app-description"
			></textarea>
		</div>
		<div class="mb-4">
			<label for="app-organization" class="block text-gray-700 dark:text-gray-300"
				>Organization</label
			>
			<input
				type="text"
				class="border rounded-md px-3 w-full bg-white dark:bg-black dark:text-white border-gray-300"
				bind:value={organization}
				id="app-organization"
			/>
		</div>
		<div class="mb-4">
			<label for="app-price" class="block text-gray-700 dark:text-gray-300">Price</label>
			<input
				type="text"
				class="border rounded-md px-3 w-full bg-white dark:bg-black dark:text-white border-gray-300"
				bind:value={price}
				id="app-price"
			/>
		</div>
		<div class="mb-4">
			<label for="app-tags" class="block text-gray-700 dark:text-gray-300"
				>Tags (comma separated)</label
			>
			<input
				type="text"
				class="border rounded-md px-3 w-full bg-white dark:bg-black dark:text-white border-gray-300"
				bind:value={tags}
				id="app-tags"
			/>
		</div>
		<div class="flex justify-end">
			<button class="btn btn-secondary mr-2" on:click={() => dispatch('close')}>Cancel</button>
			<button class="btn btn-primary" on:click={handleAddApp}>Add App</button>
		</div>
	</div>
</div>
