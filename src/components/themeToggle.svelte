<script>
	import { onMount } from 'svelte';

	let isDarkMode = false;

	onMount(() => {
		// Check the initial theme preference
		isDarkMode = localStorage.getItem('theme') === 'dark';
		updateTheme();
	});

	const toggleTheme = () => {
		isDarkMode = !isDarkMode;
		localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
		updateTheme();
	};

	const updateTheme = () => {
		if (isDarkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	};
</script>

<label class="switch">
	<input type="checkbox" on:change={toggleTheme} bind:checked={isDarkMode} />
	<span class="slider"></span>
</label>

<style>
	.switch {
		position: relative;
		display: inline-block;
		width: 60px;
		height: 34px;
	}

	.switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #ccc;
		transition: 0.4s;
		border-radius: 10px;
	}

	.slider:before {
		position: absolute;
		content: '';
		height: 26px;
		width: 26px;
		left: 4px;
		bottom: 4px;
		background-color: white;
		transition: 0.4s;
		border-radius: 25%;
	}

	input:checked + .slider {
		background-color: #3a3a3a;
	}

	input:checked + .slider:before {
		transform: translateX(26px);
	}
</style>
