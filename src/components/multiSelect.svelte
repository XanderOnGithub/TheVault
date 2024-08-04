<script>
	import { createEventDispatcher } from 'svelte';

	export let items = [];
	export let selectedItems = [];

	const dispatch = createEventDispatcher();

	const toggleSelection = (item) => {
		if (selectedItems.includes(item)) {
			selectedItems = selectedItems.filter((selected) => selected !== item);
		} else {
			selectedItems = [...selectedItems, item];
		}
		dispatch('change', selectedItems);
	};

	let isOpen = false;

	const openDropdown = () => {
		isOpen = true;
	};

	const closeDropdown = () => {
		isOpen = false;
	};
</script>

<div class="relative inline-block" on:mouseenter={openDropdown} on:mouseleave={closeDropdown}>
	<button class="btn btn-secondary">Select Tags</button>
	{#if isOpen}
		<div class="absolute bg-white shadow-md mt-2 w-48 z-10">
			{#each items as item}
				<button
					class="block w-full text-left px-4 py-2 hover:bg-gray-200 {selectedItems.includes(item)
						? 'bg-gray-300'
						: ''}"
					on:click={() => toggleSelection(item)}
				>
					{item}
				</button>
			{/each}
		</div>
	{/if}
</div>
