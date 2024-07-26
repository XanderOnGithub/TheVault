<script>
	let search = '';
</script>

<form class="max-w-md mx-auto py-5">
	<label for="default-search" class="mb-2 text-sm font-medium text-zinc-900 sr-only dark:text-white"
		>Search</label
	>
	<div class="relative">
		<div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
			<svg
				class="w-4 h-4 text-zinc-500 dark:text-zinc-400"
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 20 20"
			>
				<path
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
				/>
			</svg>
		</div>
		<input
			type="search"
			id="default-search"
			class="block w-full p-4 ps-10 text-sm text-zinc-900 border border-zinc-300 rounded-lg bg-zinc-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
			placeholder="Search apps..."
			required
			bind:value={search}
		/>
		<button
			type="submit"
			class="text-white absolute end-2.5 bottom-2.5 bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700"
			>Search</button
		>
	</div>
</form>
