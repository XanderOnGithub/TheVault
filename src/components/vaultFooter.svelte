<script>
	import ThemeToggle from './ThemeToggle.svelte';
</script>

<!-- Footer with theme toggle and copyright -->
<footer
	class="py-6 border-t border-dashed bg-white dark:bg-black border-black dark:border-white flex justify-between px-5"
>
	<p class="text-center text-gray-400">
		☻ {new Date().getFullYear()} The Vault. No rights reserved.
	</p>

	<!-- Theme Toggler -->
	<ThemeToggle />
</footer>
