<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import DateTimeText from '../dateTimeText.svelte';
	import { logout } from '$lib/firebase/authService';

	export let currentUser = null;

	function handleLogout() {
		logout();
		goto('/');
	}
</script>

<nav
	class="bg-white dark:bg-black text-black dark:text-white relative border-b border-black dark:border-white w-full"
>
	<!-- Navbar Container -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
		<!-- Navbar Content -->
		<div class="flex justify-between items-center h-16 relative w-full">
			<!-- Date and Time -->
			<div class="items-center space-x-4 hidden sm:flex">
				<DateTimeText />
			</div>

			<!-- Welcome Username (Small Screens) -->
			{#if currentUser !== null}
				<div class="sm:hidden">
					<p class="text-sm">Welcome {currentUser.displayName},</p>
				</div>
			{/if}

			<!-- Logo -->
			<div class="absolute left-1/2 transform -translate-x-1/2">
				<a href="/" class="text-xl md:text-2xl font-bold">THE VAULT</a>
			</div>

			<!-- Buttons -->
			<div class="flex items-center space-x-6 sm:space-x-reverse sm:flex-row ml-auto sm:ml-0">
				{#if currentUser !== null}
					<div class="hidden sm:block">
						<p class="pe-5">Welcome {currentUser.displayName},</p>
					</div>
					<button
						class="mono text-sm md:text-base text-gray-400 hover:text-black dark:hover:text-white dark:hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] transition duration-300 ease-in-out"
						on:click={handleLogout}>Logout</button
					>
					{#if currentUser != null && currentUser.role >= 2}
						<button>
							<a
								href="/apps"
								class="btn btn-primary flex items-center rounded-md bg-gray-300 hover:bg-gray-400 dark:bg-white dark:hover:bg-gray-100 dark:text-black px-5 py-2 text-sm"
								>Admin</a
							>
						</button>
					{/if}
				{:else}
					<a
						href="/auth"
						class="mono text-sm md:text-base text-gray-400 hover:text-black dark:hover:text-white dark:hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] transition duration-300 ease-in-out"
						>Join Now</a
					>
				{/if}
			</div>
		</div>
	</div>
</nav>
