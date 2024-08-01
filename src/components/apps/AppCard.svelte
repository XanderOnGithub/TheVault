<script>
	export let app;

	const handleClick = (id) => {
		// Navigate to the app detail page
		window.location.href = `/apps/${id}`;
	};
</script>

<div class="card w-full bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
	<div class="card-body">
		<h2 class="card-title text-3xl font-extrabold mb-4 text-accent">
			<a
				href="#"
				on:click|preventDefault={() => handleClick(app.id)}
				class="hover:text-accent-focus transition-colors duration-200"
			>
				{app.name}
			</a>
		</h2>
		<p class="text-base-content mb-4">{app.description}</p>
		<p class="text-lg text-base-content mb-4">
			<strong>Price:</strong>
			{app.price === '0.00' ? 'FREE' : '$' + app.price}
		</p>
		<p class="text-sm text-base-content mb-2"><strong>Organization:</strong> {app.organization}</p>
		<p class="text-sm text-base-content mb-4">
			<strong>Tags:</strong>
			{#each app.tags as tag}
				<span class="badge badge-primary mr-1">{tag}</span>
			{/each}
		</p>
		<button class="btn btn-primary mt-4" on:click={() => handleClick(app.id)}>
			View Details
		</button>
	</div>
</div>
