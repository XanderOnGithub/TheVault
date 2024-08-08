<script>
	export let tag = '';

	// Function to convert string to title case
	function toTitleCase(str) {
		return str.replace(/\w\S*/g, function (txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	}
</script>

<span class="tag rounded-md bg-gray-200 dark:bg-white text-black dark:text-black px-3 py-2 mr-2">
	{toTitleCase(tag)}
</span>
