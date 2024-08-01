<script>
	// Import necessary modules and components
	import { page } from '$app/stores';
	import { login, register, setUsername, user } from '$lib/firebase/authService';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';
	import PasswordStrength from '../../components/auth/passwordStrength.svelte';

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
					await setUsername(username); // Set username
					goto('/apps'); // Redirect to apps page
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

<main class="flex items-center justify-center min-h-screen bg-gray-100">
	<div class="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg z-10">
		<h1 class="text-center text-3xl font-extrabold text-gray-900">
			{titles[$mode]}
		</h1>

		<form class="mt-8 space-y-6" on:submit|preventDefault={handleAuth}>
			{#if $mode === 'login' || $mode === 'register'}
				<div class="rounded-md shadow-sm -space-y-px">
					<div>
						<label for="email" class="sr-only">Email address</label>
						<input
							type="email"
							id="email"
							bind:value={email}
							class="input input-bordered w-full"
							placeholder="Email"
							required
						/>
					</div>
					<div>
						<label for="password" class="sr-only">Password</label>
						<input
							type="password"
							id="password"
							bind:value={password}
							class="input input-bordered w-full mt-2"
							placeholder="Password"
							required
						/>
					</div>
				</div>
				{#if $mode === 'register'}
					<PasswordStrength {password} />
				{/if}
			{/if}
			{#if $mode === 'add-username'}
				<div class="rounded-md shadow-sm -space-y-px">
					<div>
						<label for="username" class="sr-only">Username</label>
						<input
							type="text"
							id="username"
							bind:value={username}
							class="input input-bordered w-full"
							placeholder="Username"
							required
						/>
					</div>
				</div>
			{/if}
			{#if $errorMessage}
				<p class="text-red-500 text-center">{$errorMessage}</p>
			{/if}
			<div class="flex justify-center">
				<button type="submit" class="btn btn-primary w-full">
					{titles[$mode]}
				</button>
			</div>
		</form>

		{#if $mode === 'login' || $mode === 'register'}
			<div class="flex justify-center">
				<button
					type="button"
					class="btn btn-link"
					on:click={() => switchMode($mode === 'login' ? 'register' : 'login')}
				>
					{$mode === 'login' ? "Don't have an account? Register" : 'Already have an account? Login'}
				</button>
			</div>
		{/if}
	</div>
</main>
