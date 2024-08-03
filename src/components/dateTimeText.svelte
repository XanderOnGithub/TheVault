<script>
	import { onMount } from 'svelte';

	// On mount (Page Load)
	onMount(() => {
		// Update the date and time every minute
		setInterval(updateDateTime, 1000);

		// Initial call to display the date and time immediately
		updateDateTime();
	});

	// Format the date and time as MM/DD/YYYY HH:MM
	function formatDateTime(date) {
		const month = date.getMonth() + 1;
		const day = date.getDate();
		const year = date.getFullYear();
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		return `${month}/${day}/${year} ${hours}:${minutes}`;
	}

	// Update the date and time in the navbar
	function updateDateTime() {
		const now = new Date();
		if (document.getElementById('date-time')) {
			document.getElementById('date-time').textContent = formatDateTime(now);
		}
	}
</script>

<p class="text-sm md:text-base mono text-gray-400" id="date-time">8/1/2024 22:00</p>
