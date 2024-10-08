<script>
	import { goto } from '$app/navigation';
	import DateTimeText from '../components/dateTimeText.svelte';
	import VaultFooter from '../components/vaultFooter.svelte';
	import { user, logout } from '../lib/firebase/authService';
	import { get } from 'svelte/store';

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

	const handleLoginRedirect = () => {
		if (currentUser !== null) {
			goto('/apps');
		} else {
			goto('/auth?mode=login');
		}
	};

	const handleRegisterRedirect = () => {
		goto('/auth?mode=register');
	};

	const handleLogout = async () => {
		try {
			await logout();
			currentUser = get(user);
		} catch (error) {
			console.error('Error logging out:', error.message);
		}
	};
</script>

<main
	class="flex flex-col min-h-screen overflow-x-hidden bg-white dark:bg-black text-black dark:text-white"
>
	<!-- Navbar -->
	<nav class="relative border-b border-black dark:border-white w-full">
		<!-- Navbar Container -->
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
			<!-- Navbar Content -->
			<div class="flex justify-between items-center h-16 relative w-full">
				<!-- Date and Time -->
				<div class="items-center space-x-4 hidden sm:flex">
					<DateTimeText />
				</div>

				<!-- Logo -->
				<div class="absolute left-1/2 transform -translate-x-1/2">
					<a href="/" class="text-xl md:text-2xl font-bold">THE VAULT</a>
				</div>

				<!-- Buttons -->
				<div
					class="hidden sm:flex items-center space-x-6 sm:space-x-reverse sm:flex-row-reverse ml-auto sm:ml-0"
				>
					{#if currentUser}
						<p class="mono text-sm md:text-base text-black dark:text-white">
							Welcome {currentUser.displayName},
							<button
								class="mono text-sm md:text-base text-gray-400 hover:text-black dark:hover:text-white dark:hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] transition duration-300 ease-in-out"
								on:click={handleLogout}>Logout</button
							>
						</p>
					{:else}
						<button
							class="mono text-sm md:text-base text-gray-400 hover:text-black dark:hover:text-white dark:hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] transition duration-300 ease-in-out"
							on:click={handleLoginRedirect}>Login</button
						>
						<button
							class="mono text-sm md:text-base text-gray-400 hover:text-black dark:hover:text-white dark:hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] transition duration-300 ease-in-out"
							on:click={handleRegisterRedirect}>Register</button
						>
					{/if}
				</div>
			</div>
		</div>
	</nav>
	<!-- Hero Section -->
	<section
		class="relative flex items-center justify-center xl:justify-between flex-grow px:0 lg:px-5 xl:px-10"
	>
		<div class="absolute inset-0 opacity-50"></div>
		<div class="relative z-10 max-w-2xl text-center xl:text-left text-black dark:text-white p-8">
			<h1 class="text-6xl font-extrabold mb-4">ENTER THE VAULT</h1>
			<p class="text-lg mb-6 text-gray-400">
				Your Ultimate Repository for Apps - Discover, Download, and Share the Best Apps for Every
				Platform, All for Free
			</p>

			<p class="mb-6 text-gray-400 responsive-line"></p>

			<button
				class="mono text-xl text-gray-400 hover:text-black dark:hover:text-white dark:hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] transition duration-300 ease-in-out"
				on:click={handleLoginRedirect}>Enter Now</button
			>
		</div>
		<div class="absolute xl:relative max-w-2xl p-20 opacity-5 xl:opacity-75 flex justify-center">
			<svg
				id="Layer_1"
				data-name="Layer 1"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 369.01 363.73"
				class="vault fill-black dark:fill-white"
			>
				<defs>
					<style>
						.cls-1 {
							stroke-width: 0px;
						}
					</style>
				</defs>
				<path
					class="cls-1"
					d="M103.84,41.64c-.54-7.32-1.1-15.79-1.81-24.24-.23-2.68.59-4.27,3.22-5.22,10.66-3.81,21.31-7.68,31.89-11.7,3.02-1.15,4.69-.2,6.39,2.25,4.54,6.53,9.38,12.85,13.9,19.39,1.67,2.42,3.51,3.37,6.43,2.92,7.46-1.14,14.96-1.73,22.54-1.61,5.68.09,11.32.38,16.89,1.45,3.99.77,6.84,0,9.19-3.74,3.86-6.16,8.38-11.9,12.43-17.95,1.94-2.91,3.95-3.8,7.4-2.46,10.43,4.04,20.96,7.84,31.49,11.61,2.85,1.02,3.51,2.81,3.23,5.61-.82,8.04-1.4,16.1-2.18,24.14-.25,2.61.65,4.27,2.9,5.64,12.19,7.41,22.72,16.84,32.38,27.25,1.81,1.96,3.35,2.55,5.94,1.8,7.9-2.26,15.9-4.17,23.81-6.41,2.82-.8,4.46-.19,5.92,2.41,5.49,9.75,11.09,19.44,16.83,29.04,1.58,2.64,1.04,4.38-.97,6.35-5.67,5.58-11.15,11.35-16.87,16.87-2.1,2.02-2.69,3.89-1.86,6.77,4.03,13.87,7.45,27.88,7.37,42.46-.01,2.53,1.56,3.53,3.47,4.42,7.21,3.35,14.39,6.79,21.65,10.03,3.04,1.35,4.12,3,3.4,6.55-2.17,10.69-3.97,21.46-5.71,32.23-.5,3.1-1.89,4.32-4.97,4.57-7.78.62-15.54,1.61-23.32,2.27-2.7.23-4.53,1.18-5.64,3.75-5.79,13.41-12.43,26.34-22.21,37.39-1.35,1.53-1.27,2.99-.39,4.79,3.53,7.27,6.82,14.67,10.42,21.9,1.57,3.14,1.42,5.19-1.56,7.55-8.66,6.86-17.08,14.03-25.51,21.17-2.12,1.8-3.9,1.79-6.12.23-6.4-4.48-12.99-8.72-19.33-13.28-2.68-1.93-4.9-1.86-7.78-.43-12.58,6.25-25.5,11.67-39.43,14.2-2.47.45-3.55,1.85-4.17,4.23-2.09,7.95-4.46,15.82-6.57,23.77-.78,2.94-2.29,4.17-5.42,4.13-10.92-.14-21.85-.14-32.77,0-3.26.04-4.88-1.18-5.69-4.33-2.05-7.96-4.4-15.84-6.52-23.78-.58-2.19-1.61-3.51-3.96-3.92-13.97-2.41-26.81-8.05-39.41-14.22-3.03-1.48-5.35-1.55-8.14.47-6.11,4.42-12.48,8.5-18.66,12.84-2.61,1.83-4.62,1.76-7.15-.4-8.21-6.99-16.56-13.82-25.02-20.49-2.86-2.25-3.3-4.28-1.71-7.55,3.49-7.14,6.52-14.5,9.88-21.71,1.04-2.23.92-3.97-.66-5.91-9.03-11.06-15.77-23.47-21.2-36.61-1.01-2.43-2.54-3.42-5.17-3.64-7.78-.64-15.54-1.63-23.32-2.29-3.31-.28-4.96-1.51-5.52-5.02-1.77-11.04-3.85-22.03-5.93-33.01-.54-2.84.76-4.25,3.09-5.33,7.22-3.34,14.38-6.81,21.62-10.09,2.34-1.06,3.5-2.47,3.63-5.16.64-13.94,3.21-27.56,7.42-40.84,1.04-3.28.48-5.44-1.99-7.82-5.62-5.42-10.86-11.25-16.42-16.73-2.24-2.21-2.34-4.16-.8-6.76,5.7-9.62,11.34-19.29,16.85-29.02,1.43-2.53,3.13-2.86,5.69-2.14,8.04,2.26,16.15,4.29,24.19,6.58,2.27.64,3.72.13,5.31-1.57,9.98-10.66,20.75-20.42,33.24-28.12,1.69-1.04,2.54-2.36,1.9-5.48ZM54.51,204.51c1.81-.6,2.92.8,3.63,3.29,1.9,6.6,3.4,13.32,5.99,19.71,7.24,17.9,17.84,33.48,32.22,46.42,2.27,2.04,2.65,3.76.47,6.07-.9.95-2.42,2.2-.74,3.77,1.77,1.66,3.23.73,4.42-.79,1.84-2.35,3.72-2.2,5.83-.39,1.02.87,2.18,1.58,3.28,2.36,20.16,14.37,42.59,22.27,67.35,23.39,3.06.14,5.34.58,4.98,4.48-.15,1.58.65,2.93,2.59,2.92,2.09,0,2.41-1.49,2.27-3.06-.34-3.61,1.78-4.18,4.73-4.34,4.97-.27,9.99-.46,14.88-1.32,20.37-3.58,39.06-11.2,55.49-23.95,2.52-1.95,4.81-3.05,6.99.48.81,1.31,2.1,1.63,3.45.49,1.12-.95,1.41-2.15.38-3.16-3.57-3.52-1.23-5.68,1.45-8.19,12.06-11.27,21.27-24.56,28.35-39.48,3.85-8.13,6.03-16.7,8.47-25.24.66-2.3,1.51-4.04,4.44-3.26,1.49.4,3.16,1.07,3.76-1.46.64-2.7-1.22-2.93-2.92-3.27-2.74-.55-3.21-2.19-2.94-4.74,2.75-25.93-.78-50.8-12.94-74.13-1.52-2.92-2.23-5.18,1.62-6.68,1.74-.68,1.94-1.94.97-3.58-.92-1.55-2.03-1.78-3.28-.69-3.11,2.69-4.74,1.05-6.63-1.7-14.77-21.47-33.56-38.19-57.89-48.18-2.78-1.14-3.9-2.61-2.54-5.53.63-1.35,1.2-2.76-.97-3.58-2-.76-3.18-.14-3.71,1.74-.96,3.42-3.08,3.24-5.94,2.47-12.27-3.28-24.72-5.61-37.47-5.6-13.02.01-25.74,2.35-38.27,5.71-2.54.68-4.47.76-5.37-2.25-.5-1.66-1.32-3.01-3.51-2.08-2.1.89-1.39,2.43-.83,3.72,1.16,2.68.44,4.19-2.28,5.31-24.42,10.07-43.52,26.6-58.23,48.36-1.86,2.75-3.58,4.35-6.66,1.64-1.3-1.15-2.35-.74-3.25.74-.9,1.47-.8,2.65.78,3.29,4.14,1.7,3.32,4.14,1.69,7.35-11.68,23.13-15.75,47.65-12.73,73.33.35,2.98-.36,4.68-3.4,5.2-1.56.27-2.92.81-2.59,2.86.38,2.35,1.96,2.17,4.62,1.54Z"
				/>
				<path
					class="cls-1"
					d="M231.05,179.5c.26,26.37-21.07,46.48-46.57,46.47-26.08,0-46.52-20.09-46.68-46.87-.15-24.05,19.54-46.85,47.48-46.44,25.27.37,45.77,21.04,45.77,46.84Z"
				/>
				<path
					class="cls-1"
					d="M235.08,147.29c-1.56.07-2.17-.89-2.8-1.74-5.87-7.95-13.23-14.16-22.02-18.64-2.59-1.32-2.95-2.99-2-5.59,5.79-15.82,11.52-31.66,17.13-47.55,1.1-3.11,2.52-4.08,5.66-2.65,9.72,4.44,19.07,9.5,27.23,16.47,9.46,8.08,18.2,16.83,24.98,27.4,1.69,2.64,1.58,4.18-1.24,5.78-14.9,8.44-29.73,16.99-44.59,25.49-.81.46-1.71.77-2.34,1.05Z"
				/>
				<path
					class="cls-1"
					d="M161.55,123.77c.08,1.61-1.02,2.24-2.08,2.81-9.01,4.83-17.19,10.62-22.87,19.39-1.66,2.57-3.57.98-5.25.02-11.23-6.41-22.43-12.88-33.65-19.32-3.62-2.08-7.23-4.19-10.91-6.16-2.22-1.18-2.92-2.43-1.39-4.77,9.49-14.54,21.37-26.68,36.17-35.81,5.49-3.38,10.98-6.85,17.15-9.01,2.06-.72,3.62-.84,4.51,1.6,6.03,16.73,12.08,33.44,18.12,50.16.14.37.16.79.21,1.07Z"
				/>
				<path
					class="cls-1"
					d="M302.28,177.75c-.17,6.51-.04,11.21-.71,15.92-.39,2.8-1.61,3.76-4.29,3.27-16.96-3.08-33.92-6.17-50.89-9.19-2.56-.46-3.78-1.59-3.53-4.33.85-9.47-.98-18.53-4.62-27.22-1.33-3.18-.46-4.85,2.41-6.48,14.41-8.18,28.78-16.44,43.04-24.89,3.36-1.99,4.97-1.18,6.5,2.03,7.94,16.68,12.23,34.17,12.08,50.9Z"
				/>
				<path
					class="cls-1"
					d="M124,192.49c3.19-.34,3.68,1.43,4.29,3.1,2.63,7.24,5.7,14.21,10.48,20.39,1.83,2.37,5.71,3.73,5.24,7.17-.4,2.9-3.47,4.66-5.36,6.92-9.75,11.67-19.66,23.22-29.4,34.91-1.85,2.22-3.09,2.23-5.17.28-17.6-16.49-29.19-36.39-34.59-59.94-.82-3.56,1.21-3.83,3.57-4.23,13.4-2.27,26.8-4.53,40.2-6.79,3.85-.65,7.7-1.3,10.73-1.81Z"
				/>
				<path
					class="cls-1"
					d="M184.41,61.46c11.65.33,22.8,2,33.81,4.87,3.52.92,4.18,2.49,2.94,5.79-5.96,15.9-11.83,31.83-17.59,47.8-1.07,2.98-2.59,3.47-5.5,2.71-9.16-2.39-18.42-2.39-27.56.01-2.99.79-4.37.2-5.4-2.76-5.61-16.02-11.33-32-17.16-47.95-1.17-3.2-.35-4.73,2.84-5.6,11.11-3.03,22.43-4.47,33.63-4.88Z"
				/>
				<path
					class="cls-1"
					d="M182.59,249.22c0,13.81,0,26.34,0,38.87,0,9.25-.03,9.48-9.09,8.42-21.98-2.56-42.11-9.98-59.96-23.28-2.23-1.66-2.16-2.89-.47-4.87,11.32-13.2,22.58-26.44,33.78-39.74,1.7-2.02,2.94-2.49,5.3-.77,7.48,5.43,16.13,8.03,25.16,9.29,3.39.47,5.18,1.58,4.89,5.3-.21,2.67.67,5.36.38,6.78Z"
				/>
				<path
					class="cls-1"
					d="M67.41,178.75c-1.32-17.13,3.63-33.05,9.86-48.65,3.13-7.83,3.67-7.8,10.91-3.59,12.94,7.52,25.91,14.98,38.89,22.43,5.37,3.08,5.36,3.03,3.27,8.68-3.11,8.42-5.22,17.02-4.14,26.09.44,3.7-2.24,3.84-4.56,4.26-13.78,2.53-27.58,4.99-41.37,7.47-2.39.43-4.77.85-7.16,1.28-4.47.8-5.28.4-5.62-4.24-.33-4.56-.07-9.15-.07-13.73Z"
				/>
				<path
					class="cls-1"
					d="M299.3,205.22c-1.36,8.02-4.14,16.09-7.87,23.69-6.55,13.38-14.78,25.64-25.88,35.83-2.61,2.39-4.17,2.54-6.47-.26-10.7-12.99-21.52-25.89-32.38-38.75-1.77-2.09-2.29-3.78-.09-5.87,7.14-6.77,11.23-15.38,14.36-24.51.78-2.26,1.72-3.33,4.34-2.86,16.97,3,33.95,5.87,50.93,8.78,1.99.34,3.85.81,3.06,3.95Z"
				/>
				<path
					class="cls-1"
					d="M186.84,267.6c0-8.48.1-16.97-.05-25.45-.06-3.26,1.3-4.56,4.4-4.92,9.49-1.11,18.43-3.92,26.3-9.48,2.19-1.55,3.55-1.09,5.09.76,11.21,13.44,22.43,26.87,33.7,40.25,2.22,2.64.26,3.72-1.5,5.07-12.39,9.48-26.41,15.45-41.4,19.43-7.45,1.98-15.02,2.97-22.66,3.74-2.9.29-3.92-.76-3.9-3.54.06-8.62.02-17.24.02-25.85Z"
				/>
			</svg>
		</div>
	</section>

	<!-- Footer -->
	<VaultFooter />
</main>

<style>
	.vault {
		width: 600px;
		animation: spin 15s linear infinite;
		overflow-x: hidden;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
