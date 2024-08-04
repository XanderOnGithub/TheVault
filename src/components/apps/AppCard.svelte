<script>
	export let app;

	const handleClick = (id) => {
		// Navigate to the app detail page
		window.location.href = `/apps/${id}`;
	};

	function toTitleCase(str) {
		return str.replace(/\w\S*/g, function (txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	}
</script>

<div class="bg-white dark:bg-black border border-gray-300 px-3 py-6 rounded-md">
	<div class="card-body">
		<h2 class="card-title text-3xl font-extrabold mb-4 text-accent">
			<a
				href="/apps/{app.id}"
				on:click|preventDefault={() => handleClick(app.id)}
				class="hover:text-accent-focus transition-colors duration-200"
			>
				{app.name}
			</a>
		</h2>
		<p class="text-base-content mb-4">{app.description}</p>
		<p class="text-sm text-base-content mb-2">
			Organization: <span class="text-gray-400">{app.organization}</span>
		</p>
		<p class="text-sm text-base-content mb-4">
			{#each app.tags as tag, index}
				<span class="text-gray-400 mr-1"
					>{toTitleCase(tag)}{#if index < app.tags.length - 1},
					{/if}</span
				>
			{/each}
		</p>

		<p class="mb-6 text-gray-400 responsive-line"></p>

		<p class="text-lg mono text-gray-400">
			{app.price === '0.00' ? 'FREE' : app.price}
		</p>

		<button
			class="mono text-gray-500 mt-3 hover:text-black dark:hover:text-white"
			on:click={() => handleClick(app.id)}
		>
			View Details
		</button>
	</div>
</div>
