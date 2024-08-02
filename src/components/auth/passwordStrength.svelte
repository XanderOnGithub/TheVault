<script>
	export let password = '';

	let strength = 0;
	let message = 'Unacceptable';
	let color = 'red';
	let glow = '';

	const evaluatePasswordStrength = (password) => {
		strength = 0;
		message = 'Unacceptable';
		color = 'red';
		glow = '';

		const criteria = [
			{ test: password.length >= 6, increment: 1 },
			{ test: password.length >= 8, increment: 1 },
			{ test: /[A-Z]/.test(password), increment: 1 },
			{ test: /[0-9]/.test(password), increment: 1 },
			{ test: /[^A-Za-z0-9]/.test(password), increment: 1 }
		];

		criteria.forEach(({ test, increment }) => {
			if (test) strength += increment;
		});

		const strengthLevels = [
			{ level: 1, message: 'Unacceptable', color: 'lightgray', glow: '0 0 5px lightgray' },
			{ level: 2, message: 'Common', color: 'lightgreen', glow: '0 0 10px lightgreen' },
			{ level: 3, message: 'Rare', color: 'lightblue', glow: '0 0 15px lightblue' },
			{ level: 4, message: 'Epic', color: 'purple', glow: '0 0 20px purple' },
			{ level: 5, message: 'Legendary', color: 'gold', glow: '0 0 25px gold' }
		];

		const {
			message: msg,
			color: clr,
			glow: glw
		} = strengthLevels.find(({ level }) => level === strength) || strengthLevels[0];
		message = msg;
		color = clr;
		glow = glw;
	};

	$: evaluatePasswordStrength(password);
</script>

{#if password}
	<div class="mt-2 loot">
		<div class="flex items-center justify-between">
			<span class="pe-5">{message}</span>
			<div class="w-full bg-white dark:bg-black border border-gray-300 rounded-full h-2.5">
				<div
					class="h-full rounded-full bar"
					style="width: {strength * 20}%; background-color: {color}; box-shadow: {glow};"
				></div>
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes lootAnimation {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.1);
		}
		100% {
			transform: scale(1);
		}
	}

	.loot {
		animation: lootAnimation 0.25s ease-in-out;
	}

	.bar {
		transition:
			width 0.25s ease-in-out,
			background-color 0.25s ease-in-out,
			box-shadow 0.25s ease-in-out;
	}
</style>
