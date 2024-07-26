<script>
	export let app;
</script>

<!-- Card -->
<div class="card flex flex-col justify-between rounded-lg bg-white w-72 h-[250px] shadow-lg">
	<!-- Information -->
	<div class="info border-none p-6 text-center my-auto">
		<!-- Title (App Name) -->
		<h2 class="title text-gray-800 tracking-normal leading-[1.375] font-semibold text-xl mb-2">
			{app.name}
		</h2>

		<!-- Description -->
		<p class="description text-gray-600 text-sm font-light leading-[1.5]">{app.description}</p>

		<!-- Platforms -->
		<p class="platforms text-gray-500 text-xs font-light leading-[1.5] mt-2">{app.platform}</p>
	</div>

	<!-- Footer -->
	<div
		class="footer p-3 border border-gray-200 flex items-center justify-between bg-blue-50 rounded-b-lg"
	>
		<!-- Creator -->
		<span class="creator font-light text-xs block">{app.organization}</span>

		<!-- Button (Price) -->
		<button
			class="action select-none border-none outline-none shadow-md text-white uppercase font-semibold text-xs py-3 px-6 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-md"
			>{app.price === 0 ? 'Free' : `$${app.price}`}</button
		>
	</div>
</div>

<style>
	.card {
		transition: all 1s;
	}
</style>
