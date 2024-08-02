<script>
	export let type = '';
	export let id = '';
	export let value = '';
	export let placeholder = '';
	export let required = false;
</script>

<div class="my-5">
	<label for={id} class="sr-only">{placeholder}</label>
	{#if type === 'email'}
		<input
			type="email"
			{id}
			bind:value
			class="input input-bordered rounded-md px-3 py-2 w-full bg-transparent border border-gray-300 dark:text-white"
			{placeholder}
			{required}
		/>
	{:else if type === 'password'}
		<input
			type="password"
			{id}
			bind:value
			class="input input-bordered rounded-md px-3 py-2 w-full bg-transparent border border-gray-300 dark:text-white"
			{placeholder}
			{required}
		/>
	{:else}
		<input
			type="text"
			{id}
			bind:value
			class="input input-bordered rounded-md px-3 py-2 w-full bg-transparent border border-gray-300 dark:text-white"
			{placeholder}
			{required}
		/>
	{/if}
</div>
