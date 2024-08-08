<script>
	// Import necessary modules and components
	import { createEventDispatcher } from 'svelte';
	import AddReviewModal from './AddReviewModal.svelte';
	import ChangeReviewModal from './ChangeReviewModal.svelte';
	import { fetchUsernames } from '../../lib/firebase/firestoreService';
	import { user } from '../../lib/firebase/authService';

	// Export the app prop
	/**
	 * @type {Object} app - The app object containing details about the app.
	 */
	export let app;

	// Create an event dispatcher
	const dispatch = createEventDispatcher();

	// State variables
	/**
	 * @type {boolean} showReviewModal - State to control the visibility of the review modal.
	 */
	let showReviewModal = false;

	/**
	 * @type {number} currentReviewIndex - Index of the currently displayed review.
	 */
	let currentReviewIndex = 0;

	/**
	 * @type {Array} combinedReviews - Array to store combined reviews and ratings.
	 */
	let combinedReviews = [];

	/**
	 * @type {Object} usernames - Object to store usernames fetched from the database.
	 */
	let usernames = {};

	/**
	 * @type {Object|null} currentUser - The currently logged-in user.
	 */
	let currentUser = null;

	/**
	 * @type {number} averageRating - The average rating of the app.
	 */
	let averageRating = 0;

	// Subscribe to the user store to get the current user
	const unsubscribe = user.subscribe((value) => {
		currentUser = value;
	});

	// Cleanup subscription on component destroy
	import { onDestroy } from 'svelte';
	onDestroy(() => {
		unsubscribe();
	});

	/**
	 * Load usernames and combine reviews and ratings.
	 * @async
	 */
	async function loadUsernames() {
		usernames = await fetchUsernames();
		combinedReviews = Object.keys(app.reviews).map((userID) => ({
			userID,
			review: app.reviews[userID],
			rating: app.ratings[userID],
			username: usernames[userID]
		}));
		calculateAverageRating();
	}

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

	loadUsernames();

	/**
	 * Close the modal.
	 */
	function closeModal() {
		dispatch('close');
	}

	/**
	 * Show the review modal.
	 */
	function addReview() {
		showReviewModal = true;
	}

	/**
	 * Close the review modal and refresh reviews.
	 */
	function closeReviewModal() {
		showReviewModal = false;
		loadUsernames();
	}

	/**
	 * Navigate to the next review.
	 */
	function nextReview() {
		if (currentReviewIndex < combinedReviews.length - 1) {
			currentReviewIndex++;
		}
	}

	/**
	 * Navigate to the previous review.
	 */
	function prevReview() {
		if (currentReviewIndex > 0) {
			currentReviewIndex--;
		}
	}

	/**
	 * Generate star ratings based on the rating value.
	 * @param {number} rating - The rating value.
	 * @returns {string} - The star rating string.
	 */
	function getStarRating(rating) {
		const fullStar = '★';
		const emptyStar = '☆';
		const maxStars = 5;
		return fullStar.repeat(rating) + emptyStar.repeat(maxStars - rating);
	}

	/**
	 * Check if the current user has a review.
	 * @returns {boolean} - True if the current user has a review, false otherwise.
	 */
	function userHasReview() {
		return currentUser && app.reviews && app.reviews[currentUser.uid];
	}

	/**
	 * Calculate the average rating from the combined reviews.
	 */
	function calculateAverageRating() {
		if (combinedReviews.length === 0) {
			averageRating = 0;
		} else {
			const totalRating = combinedReviews.reduce((sum, review) => sum + review.rating, 0);
			averageRating = (totalRating / combinedReviews.length).toFixed(1);
		}
	}
</script>

<!-- Modal Container -->
<div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
	<!-- Modal Content -->
	<div
		class="bg-white dark:bg-black border-gray-400 border-2 p-6 rounded-md max-w-lg w-full mx-3 relative"
	>
		<!-- Close Button -->
		<button class="absolute top-2 right-2 text-black dark:text-white text-xl" on:click={closeModal}
			>✖</button
		>

		<!-- App Details -->
		<h2 class="text-2xl mb-4 font-semibold">{app.name}</h2>
		<p class="mb-4">{app.description}</p>

		<!-- Organization -->
		<div class="mb-4">
			<p class="text-gray-400">
				<span class="text-black dark:text-white font-semibold">Organization:</span>
				{app.organization}
			</p>
		</div>

		<!-- Tags -->
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

		<!-- Average Rating -->
		<div class="mb-4">
			<p class="text-lg text-gray-400">Rating: {getStarRating(averageRating)}</p>
		</div>

		<!-- Price -->
		<div class="mb-4">
			<p class="text-lg text-gray-400">{app.price === '0.00' ? 'FREE' : app.price}</p>
		</div>

		<!-- Platforms -->
		<div class="mb-4">
			{#each Object.entries(app.platforms) as [platform, link]}
				<a
					href={link}
					target="_blank"
					rel="noopener noreferrer"
					class="text-gray-500 underline hover:text-black dark:hover:text-gray-300 mr-3"
				>
					{toTitleCase(platform)}
				</a>
			{/each}
		</div>

		<!-- Reviews Section -->
		<div class="flex justify-between items-center mb-4">
			<p class="font-semibold">Reviews:</p>
			{#if currentUser !== null}
				<button
					class="text-gray-500 hover:text-black dark:hover:text-white px-3 py-1 rounded"
					on:click={addReview}
				>
					{userHasReview() ? 'Change Review' : 'Add Review'}
				</button>
			{/if}
		</div>

		<!-- Reviews Display -->
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

<!-- Review Modal -->
{#if showReviewModal}
	{#if userHasReview()}
		<ChangeReviewModal
			appId={app.id}
			review={combinedReviews[currentReviewIndex]}
			on:close={closeReviewModal}
		/>
	{:else}
		<AddReviewModal appId={app.id} on:close={closeReviewModal} />
	{/if}
{/if}
