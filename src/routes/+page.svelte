<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import ThemeToggle from '../components/themeToggle.svelte';

	const handleLoginRedirect = () => {
		goto('/auth?mode=login');
	};

	const handleRegisterRedirect = () => {
		goto('/auth?mode=register');
	};

	// On mount (Page Load)
	onMount(() => {
		// Update the date and time every minute
		setInterval(updateDateTime, 30000);

		// Initial call to display the date and time immediately
		updateDateTime();
	});

	// Format the date and time as MM/DD/YYYY HH:MM
	function formatDateTime(date) {
		const month = date.getMonth() + 1;
		const day = date.getDate();
		const year = date.getFullYear();
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		return `${month}/${day}/${year} ${hours}:${minutes}`;
	}

	// Update the date and time in the navbar
	function updateDateTime() {
		const now = new Date();
		document.getElementById('date-time').textContent = formatDateTime(now);
	}
</script>

<main class="flex flex-col min-h-screen bg-white dark:bg-black text-black dark:text-white">
	<!-- Navbar -->
	<nav class="shadow-md relative border-b border-black dark:border-white">
		<!-- Navbar Container -->
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<!-- Navbar Content -->
			<div class="flex justify-between items-center h-16 relative">
				<!-- Date and Time -->
				<div class="flex items-center space-x-4 lg:-mx-20">
					<p class="mono text-gray-400" id="date-time">8/1/2024 22:00</p>
				</div>

				<!-- Logo -->
				<div class="absolute left-1/2 transform -translate-x-1/2">
					<a href="/" class="text-2xl font-bold">THE VAULT</a>
				</div>

				<!-- Buttons -->
				<div class="flex items-center space-x-6 ml-auto lg:-mx-20">
					<button
						class="mono text-gray-400 hover:text-black dark:hover:text-white hover:drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] dark:hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] transition duration-300 ease-in-out"
						on:click={handleLoginRedirect}>Login</button
					>
					<button
						class="mono text-gray-400 hover:text-black dark:hover:text-white hover:drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] dark:hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] transition duration-300 ease-in-out"
						on:click={handleRegisterRedirect}>Register</button
					>
				</div>
			</div>
		</div>
	</nav>

	<!-- Hero Section -->
	<section
		class="relative flex items-center justify-center md:justify-start flex-grow px:0 md:px-5 lg:px-10"
	>
		<div class="absolute inset-0 opacity-50"></div>
		<div class="relative z-10 max-w-2xl text-center md:text-left text-black dark:text-white p-8">
			<h1 class="text-6xl font-extrabold mb-4">ENTER THE VAULT</h1>
			<p class="text-lg mb-6 text-gray-400">
				Your Ultimate Repository for Apps - Discover, Download, and Share the Best Apps for Every
				Platform, All for Free
			</p>

			<p class="mb-6 text-gray-400 responsive-line"></p>

			<button
				class="mono text-xl hover:text-black dark:hover:text-white hover:drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] dark:hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] transition duration-300 ease-in-out"
				on:click={handleRegisterRedirect}>Join Now</button
			>
		</div>
	</section>

	<!-- Footer -->
	<footer
		class="py-6 border-t border-dashed border-black dark:border-white flex justify-between px-5"
	>
		<p class="text-center text-gray-400">
			☻ {new Date().getFullYear()} The Vault. No rights reserved.
		</p>

		<ThemeToggle />
	</footer>
</main>

<style>
	.responsive-line {
		border-top: 2px dashed gray;
		width: 100%;
		margin: 1rem 0;
	}
</style>
