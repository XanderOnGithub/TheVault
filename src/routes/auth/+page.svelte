<script>
	// Import necessary modules and components
	import { page } from '$app/stores';
	import { login, register, setUsername, user } from '$lib/firebase/authService';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';
	import PasswordStrength from '../../components/auth/passwordStrength.svelte';
	import VaultFooter from '../../components/vaultFooter.svelte';
	import AuthInput from '../../components/auth/authInput.svelte';
	import AuthError from '../../components/auth/authError.svelte';

	// Initialize variables for form inputs
	let email = '';
	let password = '';
	let username = '';

	// Create writable stores for mode and error message
	const mode = writable('login'); // Possible values: 'login', 'register', 'add-username'
	const errorMessage = writable('');

	// Titles for different modes
	const titles = {
		login: 'Login',
		register: 'Register',
		'add-username': 'Add Username'
	};

	// Function to handle authentication based on the current mode
	const handleAuth = async () => {
		try {
			switch ($mode) {
				case 'login':
					await login(email, password); // Perform login
					goto('/apps'); // Redirect to apps page
					break;
				case 'register':
					const newUser = await register(email, password); // Perform registration
					if (newUser) mode.set('add-username'); // Switch to add-username mode if registration is successful
					break;
				case 'add-username':
					try {
						await setUsername(username); // Set username
						goto('/apps'); // Redirect to apps page
					} catch (error) {
						errorMessage.set(error.message); // Set error message if any error occurs
					}
					break;
			}
		} catch (error) {
			errorMessage.set(error.message); // Set error message if any error occurs
		}
	};

	// Reactive statement to set the mode based on the query parameter
	$: {
		const query = $page.url.searchParams.get('mode');
		mode.set(query || 'login'); // Default to 'login' if no query parameter is present
	}

	// Function to switch between modes and reset the error message
	const switchMode = (newMode) => {
		mode.set(newMode);
		errorMessage.set('');
	};
</script>

<main class="flex flex-col min-h-screen bg-white dark:bg-black text-black dark:text-white">
	<!-- Navbar -->
	<nav class="relative border-b border-black dark:border-white w-full">
		<!-- Navbar Container -->
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
			<!-- Navbar Content -->
			<div class="flex justify-between items-center h-16 relative w-full">
				<!-- Back Button -->
				<div class="absolute left-0">
					<a href="/" class="text-xl md:text-2xl font-bold">&LeftArrow;</a>
				</div>
				<!-- Logo -->
				<div class="absolute left-1/2 transform -translate-x-1/2">
					<a href="/" class="text-xl md:text-2xl font-bold">THE VAULT</a>
				</div>
			</div>
		</div>
	</nav>

	<div class="flex items-center justify-center flex-grow">
		<div class="max-w-md w-full p-10 py-20 rounded-md z-10">
			<h1 class="text-center text-3xl font-extrabold">
				{titles[$mode]}
			</h1>

			<form class="mt-8" on:submit|preventDefault={handleAuth}>
				{#if $mode === 'login' || $mode === 'register'}
					<div>
						<!-- Email & Password Input -->
						<AuthInput
							type="email"
							id="email"
							bind:value={email}
							placeholder="Email"
							required={true}
						/>

						<AuthInput
							type="password"
							id="password"
							bind:value={password}
							placeholder="Password"
							required={true}
						/>
					</div>

					{#if $mode === 'register'}
						<PasswordStrength {password} />
					{/if}
				{/if}
				{#if $mode === 'add-username'}
					<div class="rounded-md shadow-sm">
						<div>
							<label for="username" class="sr-only">Username</label>
							<AuthInput
								type="text"
								id="username"
								bind:value={username}
								placeholder="Username"
								required={true}
							/>
						</div>
					</div>
				{/if}
				{#if $errorMessage}
					<p class="text-red-500 text-center">{$errorMessage}</p>
				{/if}
				<div class="flex justify-center pb-12">
					<button type="submit" class="btn btn-primary w-full">
						{titles[$mode]}
					</button>
				</div>
			</form>

			{#if $mode === 'login' || $mode === 'register'}
				<div class="flex justify-center">
					<button
						type="button"
						class="pb-3"
						on:click={() => switchMode($mode === 'login' ? 'register' : 'login')}
					>
						{$mode === 'login'
							? "Don't have an account? Register"
							: 'Already have an account? Login'}
					</button>
				</div>

				<div class="flex justify-center">
					<button type="button" class="btn btn-link text-gray-400" on:click={() => goto('/apps')}>
						Continue as guest
					</button>
				</div>
			{/if}
		</div>
	</div>

	<!-- Footer -->
	<VaultFooter />
</main>
