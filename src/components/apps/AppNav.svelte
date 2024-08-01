<script>
	import { logout } from '$lib/firebase/authService';
	import { goto } from '$app/navigation';

	const handleLogout = async () => {
		const confirmed = confirm('Are you sure you want to log out?');
		if (confirmed) {
			await logout();
			goto('/');
		}
	};
</script>

<nav class="navbar bg-base-200 shadow-md mb-4 px-5 py-2">
	<div class="flex-1">
		<h1 class="font-bold text-xl">The Vault</h1>
	</div>
	<div class="flex-none">
		<button class="btn btn-outline btn-error" on:click={handleLogout} aria-label="Logout">
			Logout
		</button>
	</div>
</nav>
