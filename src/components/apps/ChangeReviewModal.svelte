<script>
	import { createEventDispatcher } from 'svelte';
	import { updateReviewForApp, removeReviewFromApp } from '../../lib/firebase/firestoreService';
	import { user } from '../../lib/firebase/authService'; // Assuming this is a store
	import { get } from 'svelte/store';

	export let appId;
	let rating = 1;
	let reviewText = '';
	const dispatch = createEventDispatcher();
	const characterLimit = 500;

	const handleSubmit = async () => {
		const intRating = parseInt(rating, 10);
		if (reviewText.length > characterLimit) {
			alert(`Review text cannot exceed ${characterLimit} characters.`);
			return;
		}

		const currentUser = get(user); // Get the current user from the store
		const userId = currentUser?.uid; // Access the UID property

		if (!userId) {
			alert('User is not authenticated');
			return;
		}

		const success = await updateReviewForApp(appId, userId, intRating, reviewText);
		if (success) {
			dispatch('close');
		} else {
			alert('Failed to update review');
		}
	};

	const handleRemove = async () => {
		const currentUser = get(user); // Get the current user from the store
		const userId = currentUser?.uid; // Access the UID property

		if (!userId) {
			alert('User is not authenticated');
			return;
		}

		const success = await removeReviewFromApp(appId, userId, userId);
		if (success) {
			dispatch('close');
		} else {
			alert('Failed to remove review');
		}
	};
</script>

<div class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
	<div
		class="bg-white dark:bg-black border border-gray-300 px-6 py-6 rounded-md shadow-lg max-w-md w-full"
	>
		<h2 class="text-2xl font-bold mb-4 text-accent">Change Review</h2>
		<div class="mb-4">
			<label class="block text-gray-700 dark:text-gray-300">Rating</label>
			<select
				bind:value={rating}
				class="input input-bordered w-full bg-white dark:bg-black dark:text-white border-gray-300"
			>
				<option value="1">1 Star</option>
				<option value="2">2 Stars</option>
				<option value="3">3 Stars</option>
				<option value="4">4 Stars</option>
				<option value="5">5 Stars</option>
			</select>
		</div>
		<div class="mb-4">
			<label class="block text-gray-700 dark:text-gray-300">Review</label>
			<textarea
				bind:value={reviewText}
				class="textarea textarea-bordered w-full bg-white dark:bg-black dark:text-white border-gray-300"
				maxlength={characterLimit}
			></textarea>
			<p class="text-sm text-gray-500">{reviewText.length}/{characterLimit} characters</p>
		</div>

		<div class="flex flex-row justify-between">
			<div class="flex justify-">
				<button class="text-gray-400" on:click={handleRemove}>Remove Review</button>
			</div>
			<div class="flex justify-end">
				<button class="btn btn-secondary mr-2" on:click={() => dispatch('close')}>Cancel</button>
				<button class="btn btn-primary" on:click={handleSubmit}>Submit Review</button>
			</div>
		</div>
	</div>
</div>
