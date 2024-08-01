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
	<div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
		<h2 class="text-2xl font-bold mb-4">Add New App</h2>
		<div class="mb-4">
			<label class="block text-gray-700">App Name</label>
			<input type="text" class="input input-bordered w-full" bind:value={name} />
		</div>
		<div class="mb-4">
			<label class="block text-gray-700">Description</label>
			<textarea class="textarea textarea-bordered w-full" bind:value={description}></textarea>
		</div>
		<div class="mb-4">
			<label class="block text-gray-700">Organization</label>
			<input type="text" class="input input-bordered w-full" bind:value={organization} />
		</div>
		<div class="mb-4">
			<label class="block text-gray-700">Price</label>
			<input type="text" class="input input-bordered w-full" bind:value={price} />
		</div>
		<div class="mb-4">
			<label class="block text-gray-700">Tags (comma separated)</label>
			<input type="text" class="input input-bordered w-full" bind:value={tags} />
		</div>
		<div class="flex justify-end">
			<button class="btn btn-secondary mr-2" on:click={() => dispatch('close')}>Cancel</button>
			<button class="btn btn-primary" on:click={handleAddApp}>Add App</button>
		</div>
	</div>
</div>
