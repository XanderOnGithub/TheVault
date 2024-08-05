<!-- AppModal.svelte -->
<script>
	import { createEventDispatcher } from 'svelte';
	export let app;
	const dispatch = createEventDispatcher();

	function closeModal() {
		dispatch('close');
	}

	function addReview() {
		// Implement the logic to add a review
	}
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
	<div
		class="bg-white dark:bg-black border-gray-400 border-2 p-6 rounded-md max-w-lg w-full mx-3 relative"
	>
		<button class="absolute top-2 right-2 text-black dark:text-white text-xl" on:click={closeModal}
			>✖</button
		>
		<h2 class="text-2xl mb-4 font-semibold">{app.name}</h2>
		<p class="mb-4">{app.description}</p>
		<div class="mb-4">
			<p class="text-gray-400">
				<span class="text-black dark:text-white font-semibold">Organization: </span>
				{app.organization}
			</p>
		</div>
		<div class="mb-4">
			<p class="text-gray-400">
				<span class="text-black dark:text-white font-semibold">Tags: </span>
				{#each app.tags as tag, index}
					<span class="text-gray-400 mr-1"
						>{tag}{#if index < app.tags.length - 1},
						{/if}</span
					>
				{/each}
			</p>
		</div>
		<div class="mb-4">
			<p class="text-lg text-gray-400">{app.price === '0.00' ? 'FREE' : app.price}</p>
		</div>
		<div class="mb-4">
			<a
				href={app.link}
				target="_blank"
				rel="noopener noreferrer"
				class="text-gray-500 hover:underline">Visit External Link</a
			>
		</div>
		<div class="flex justify-between items-center mb-4">
			<p class="font-semibold">Reviews:</p>
			<button
				class=" text-gray-500 hover:text-black dark:hover:text-white px-3 py-1 rounded"
				on:click={addReview}>Add Review</button
			>
		</div>
	</div>
</div>
