<script>
	import { addApp } from '../../lib/AppService';
	import { createEventDispatcher } from 'svelte';

	export let isOverlayOpen = false;
	export let onClose = () => {};

	const dispatch = createEventDispatcher();

	let AppName = '';
	let AppOrg = '';
	let AppDesc = '';
	let AppPlat = '';
	let AppVer = '';
	let AppLink = '';
	let AppPrice = 0.0;

	async function handleSubmit(event) {
		event.preventDefault();

		const newApp = {
			name: AppName,
			organization: AppOrg,
			description: AppDesc,
			platform: AppPlat,
			version: AppVer,
			link: AppLink,
			price: AppPrice,
			Comments: []
		};

		try {
			await addApp(newApp);
			dispatch('appAdded');
			onClose();
		} catch (error) {
			console.error('There was a problem adding the app:', error);
		}
	}
</script>

{#if isOverlayOpen}
	<!-- Overlay (Currently button for click to close functionality)-->
	<button
		class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 cursor-default"
		on:click={() => {
			if (isOverlayOpen) onClose();
		}}
	>
		<!-- Card (Currently button to stop click to close on the card)-->
		<button
			class="bg-white p-10 rounded-lg shadow-lg relative cursor-default"
			on:click|stopPropagation
		>
			<!-- Close Button -->
			<button
				class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
				on:click={() => {
					if (isOverlayOpen) onClose();
				}}
				aria-label="Close"
			>
				&times;
			</button>

			<!-- Overlay Content -->
			<h2 id="overlay-title" class="text-xl font-bold mb-4">Add new Application</h2>
			<p id="overlay-description">Adding a new application is a simple process.</p>

			<!-- Form -->
			<form class="mt-5" on:submit={handleSubmit}>
				<!-- Application Name -->
				<input
					type="text"
					required
					class="block w-full p-3 mt-5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
					placeholder="Application Name"
					bind:value={AppName}
				/>

				<!-- Application Organization -->
				<input
					type="text"
					required
					class="block w-full p-3 mt-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
					placeholder="Organization"
					bind:value={AppOrg}
				/>

				<!-- Application Description -->
				<textarea
					type="text"
					required
					class="block w-full p-3 mt-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
					placeholder="Application Description"
					rows="4"
					bind:value={AppDesc}
				/>

				<!-- Application Platform -->
				<input
					type="text"
					required
					class="block w-full p-3 mt-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
					placeholder="Platforms: e.g. Windows, Linux, MacOS"
					bind:value={AppPlat}
				/>

				<!-- Application Version -->
				<input
					type="text"
					required
					class="block w-full p-3 mt-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
					placeholder="Version: e.g. 1.0.0"
					bind:value={AppVer}
				/>

				<!-- External Link -->
				<input
					type="text"
					required
					class="block w-full p-3 mt-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
					placeholder="External Link"
					bind:value={AppLink}
				/>

				<!-- Price -->
				<input
					required
					type="number"
					min="0.00"
					step="0.01"
					class="block w-full p-3 mt-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
					placeholder="Price"
					bind:value={AppPrice}
				/>

				<!-- Submit Button -->
				<button
					type="submit"
					class="block w-full p-3 mt-5 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
					on:click={handleSubmit}
				>
					Add Application
				</button>
			</form>
		</button>
	</button>
{/if}
