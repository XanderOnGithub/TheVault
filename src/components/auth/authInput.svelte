<script>
	export let type = '';
	export let id = '';
	export let value = '';
	export let placeholder = '';
	export let required = false;
</script>

<div class="rounded-md shadow-sm my-5">
	<label for={id} class="sr-only">{placeholder}</label>
	{#if type === 'email'}
		<input
			type="email"
			{id}
			bind:value
			class="input input-bordered w-full mt-2"
			{placeholder}
			{required}
		/>
	{:else if type === 'password'}
		<input
			type="password"
			{id}
			bind:value
			class="input input-bordered w-full mt-2"
			{placeholder}
			{required}
		/>
	{:else}
		<input
			type="text"
			{id}
			bind:value
			class="input input-bordered w-full mt-2"
			{placeholder}
			{required}
		/>
	{/if}
</div>
