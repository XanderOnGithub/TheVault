<script>
	export let message = '';
</script>

{#if message}
	<p class="text-red-500 text-center">{message}</p>
{/if}
