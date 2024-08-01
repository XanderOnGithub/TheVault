<script>
	import { goto } from '$app/navigation';

	const handleLoginRedirect = () => {
		goto('/auth?mode=login');
	};

	const handleRegisterRedirect = () => {
		goto('/auth?mode=register');
	};
</script>

<main class="flex flex-col min-h-screen bg-gray-50">
	<!-- Navbar -->
	<nav class="bg-white shadow-md">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between h-16">
				<div class="flex">
					<div class="flex-shrink-0 flex items-center">
						<a href="/" class="text-2xl font-bold text-gray-900">The Vault</a>
					</div>
				</div>
				<div class="flex items-center space-x-4">
					<button class="btn btn-primary" on:click={handleLoginRedirect}>Login</button>
					<button class="btn btn-secondary" on:click={handleRegisterRedirect}>Register</button>
				</div>
			</div>
		</div>
	</nav>

	<!-- Hero Section -->
	<section class="relative flex items-center justify-center flex-grow">
		<div class="absolute inset-0 bg-blue-900 opacity-50"></div>
		<div class="relative z-10 max-w-2xl text-center text-white p-8">
			<h1 class="text-5xl font-extrabold mb-4">Welcome to The Vault</h1>
			<p class="text-lg mb-6">Your ultimate multi-platform app repository</p>
			<div class="flex justify-center space-x-4">
				<button class="btn px-10 btn-secondary" on:click={handleRegisterRedirect}>Join Now</button>
			</div>
		</div>
	</section>

	<!-- Features Section -->
	<section class="py-12 bg-white">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<h2 class="text-3xl font-extrabold text-gray-900 text-center mb-8">Features</h2>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
				<div class="text-center">
					<div class="text-blue-600 mb-4">
						<!-- Replace with an appropriate icon -->
						<i class="fas fa-cogs fa-3x"></i>
					</div>
					<h3 class="text-xl font-bold mb-2">Multi-Platform</h3>
					<p class="text-gray-600">View applications made for any platform</p>
				</div>
				<div class="text-center">
					<div class="text-blue-600 mb-4">
						<!-- Replace with an appropriate icon -->
						<i class="fas fa-shield-alt fa-3x"></i>
					</div>
					<h3 class="text-xl font-bold mb-2">Review</h3>
					<p class="text-gray-600">Add or read reviews to find your perfect app</p>
				</div>
				<div class="text-center">
					<div class="text-blue-600 mb-4">
						<!-- Replace with an appropriate icon -->
						<i class="fas fa-users fa-3x"></i>
					</div>
					<h3 class="text-xl font-bold mb-2">Add your own app</h3>
					<p class="text-gray-600">Request to add your own app to The Vault.</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Testimonials Section -->
	<section class="py-12 bg-gray-50">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<h2 class="text-3xl font-extrabold text-gray-900 text-center mb-8">Testimonials</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
				<div class="bg-white p-6 rounded-lg shadow-md">
					<p class="text-gray-600 mb-4">
						"The Vault has transformed the way we manage our apps. It's an indispensable tool for
						our team."
					</p>
					<p class="text-gray-900 font-bold">- Bill Gates, Famous Rich Dude</p>
				</div>
				<div class="bg-white p-6 rounded-lg shadow-md">
					<p class="text-gray-600 mb-4">
						"A fantastic repository with an intuitive interface. Highly recommend it to anyone."
					</p>
					<p class="text-gray-900 font-bold">- Xander Reyes, The dev of The Vault</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Footer -->
	<footer class="bg-white py-6">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center">
				<p class="text-gray-600">&copy; 2023 The Vault. All rights reserved.</p>
				<div class="flex space-x-4">
					<a href="/" class="text-gray-600 hover:text-gray-900">Privacy Policy</a>
					<a href="/" class="text-gray-600 hover:text-gray-900">Terms of Service</a>
				</div>
			</div>
		</div>
	</footer>
</main>
