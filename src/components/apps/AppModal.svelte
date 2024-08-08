<script>
	// Import necessary modules and components
	import { createEventDispatcher } from 'svelte';
	import AddReviewModal from './AddReviewModal.svelte';
	import { fetchUsernames } from '../../lib/firebase/firestoreService';
	import { user } from '../../lib/firebase/authService';

	// Export the app prop
	export let app;

	// Create an event dispatcher
	const dispatch = createEventDispatcher();

	// State variables
	let showReviewModal = false;
	let currentReviewIndex = 0;
	let combinedReviews = [];
	let usernames = {};
	let currentUser = null;

	// Subscribe to the user store to get the current user
	const unsubscribe = user.subscribe((value) => {
		currentUser = value;
	});

	// Cleanup subscription on component destroy
	import { onDestroy } from 'svelte';
	onDestroy(() => {
		unsubscribe();
	});

	// Load usernames and combine reviews and ratings
	async function loadUsernames() {
		usernames = await fetchUsernames();
		combinedReviews = Object.keys(app.reviews).map((userID) => ({
			userID,
			review: app.reviews[userID],
			rating: app.ratings[userID],
			username: usernames[userID]
		}));
	}

	// Function to convert string to title case
	function toTitleCase(str) {
		return str.replace(/\w\S*/g, function (txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	}

	loadUsernames();

	// Close the modal
	function closeModal() {
		dispatch('close');
	}

	// Show the review modal
	function addReview() {
		showReviewModal = true;
	}

	// Close the review modal
	function closeReviewModal() {
		showReviewModal = false;
	}

	// Navigate to the next review
	function nextReview() {
		if (currentReviewIndex < combinedReviews.length - 1) {
			currentReviewIndex++;
		}
	}

	// Navigate to the previous review
	function prevReview() {
		if (currentReviewIndex > 0) {
			currentReviewIndex--;
		}
	}

	// Generate star ratings based on the rating value
	function getStarRating(rating) {
		const fullStar = '★';
		const emptyStar = '☆';
		const maxStars = 5;
		return fullStar.repeat(rating) + emptyStar.repeat(maxStars - rating);
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
				<span class="text-black dark:text-white font-semibold"
					>Organization:
				</span>{app.organization}
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
			{#each Object.entries(app.platforms) as [platform, link]}
				<a
					href={link}
					target="_blank"
					rel="noopener noreferrer"
					class="text-gray-500 hover:underline mr-3"
				>
					{toTitleCase(platform)}
				</a>
			{/each}
		</div>
		<div class="flex justify-between items-center mb-4">
			<p class="font-semibold">Reviews:</p>
			{#if currentUser !== null}
				<button
					class="text-gray-500 hover:text-black dark:hover:text-white px-3 py-1 rounded"
					on:click={addReview}>Add Review</button
				>
			{/if}
		</div>
		{#if combinedReviews.length > 0}
			<div class="flex items-center mb-4">
				<button on:click={prevReview} disabled={currentReviewIndex === 0} class="mr-2">←</button>
				<div class="flex-1 text-center">
					<p class="text-gray-400">
						<strong>{combinedReviews[currentReviewIndex].username}</strong>: {combinedReviews[
							currentReviewIndex
						].review}
						<br />
						Rating: {getStarRating(combinedReviews[currentReviewIndex].rating)}
					</p>
				</div>
				<button
					on:click={nextReview}
					disabled={currentReviewIndex === combinedReviews.length - 1}
					class="ml-2">→</button
				>
			</div>
		{:else}
			<p class="text-gray-400">No reviews available.</p>
		{/if}
	</div>
</div>

{#if showReviewModal}
	<AddReviewModal appId={app.id} on:close={closeReviewModal} />
{/if}
