<script>
	import AppCard from './AppCard.svelte';
	export let apps = [];
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-6">
	{#each apps as app}
		<AppCard {app} />
	{/each}
</div>
