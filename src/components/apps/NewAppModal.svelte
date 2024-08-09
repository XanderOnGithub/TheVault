<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import { requestApp, fetchTags, fetchPlatforms } from '$lib/firebase/firestoreService';

	let name = '';
	let description = '';
	let organization = '';
	let price = '';
	let tags = [];
	let selectedTags = [];
	let platforms = [];
	let platformLinks = {};
	let isSubmitting = false;
	const dispatch = createEventDispatcher();

	onMount(async () => {
		tags = await fetchTags();
		platforms = await fetchPlatforms();
	});

	const handleAddApp = async () => {
		if (isSubmitting) return;
		isSubmitting = true;

		if (name && description && organization && price && selectedTags.length > 0) {
			try {
				const newApp = await requestApp(
					name,
					description,
					organization,
					price,
					selectedTags,
					platformLinks
				);
				dispatch('appadded', newApp);
			} catch (error) {
				console.error('Error adding app:', error.message);
			}
		} else {
			console.error('All fields are required');
		}

		isSubmitting = false;
	};

	const toggleTag = (tag) => {
		if (selectedTags.includes(tag)) {
			selectedTags = selectedTags.filter((t) => t !== tag);
		} else {
			selectedTags = [...selectedTags, tag];
		}
	};

	const updatePlatformLink = (platform, link) => {
		platformLinks = { ...platformLinks, [platform]: link };
	};
</script>

<div class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
	<div
		class="bg-white dark:bg-black border border-gray-300 px-6 py-6 rounded-md shadow-lg max-w-md w-full relative"
	>
		<!-- Close button in the top right corner -->
		<button
			class="absolute top-2 right-2 text-black dark:text-white text-xl"
			on:click={() => dispatch('close')}
		>
			✖
		</button>
		<h2 class="text-2xl font-bold mb-4 text-accent text-center">Request New App</h2>
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
				type="number"
				step="0.01"
				class="border rounded-md px-3 w-full bg-white dark:bg-black dark:text-white border-gray-300"
				bind:value={price}
				id="app-price"
			/>
		</div>
		<div class="mb-4">
			<label class="block text-gray-700 dark:text-gray-300">Tags</label>
			<div class="flex flex-wrap">
				{#each tags as tag}
					<button
						type="button"
						class="m-1 px-3 py-1 rounded-md border border-gray-300 text-gray-700 dark:text-gray-300"
						class:selected={selectedTags.includes(tag)}
						on:click={() => toggleTag(tag)}
					>
						{tag}
					</button>
				{/each}
			</div>
		</div>
		<div class="mb-4">
			<label class="block text-gray-700 dark:text-gray-300">Platforms</label>
			{#each platforms as platform}
				<div class="mb-2">
					<label class="block text-gray-700 dark:text-gray-300">{platform}</label>
					<input
						type="text"
						class="border rounded-md px-3 w-full bg-white dark:bg-black dark:text-white border-gray-300"
						placeholder="Enter link"
						on:input={(e) => updatePlatformLink(platform, e.target.value)}
					/>
				</div>
			{/each}
		</div>
		<div class="flex flex-col justify-center text-center">
			<p class="text-gray-400">
				By requesting this application, you are agreeing that this application follows our terms of
				service.
			</p>
			<button class="btn btn-primary mt-5" on:click={handleAddApp} disabled={isSubmitting}>
				{isSubmitting ? 'Submitting...' : 'Add App'}
			</button>
		</div>
	</div>
</div>

<style>
	.selected {
		background-color: #4caf50;
		color: white;
	}
</style>
