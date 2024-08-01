<script context="module">
	import { fetchAppById } from '$lib/firebase/firestoreService';

	export async function load({ params }) {
		const app = await fetchAppById(params.id);
		if (app) {
			return { props: { app } };
		} else {
			return { status: 404 };
		}
	}
</script>

<script>
	export let app;
</script>

<main class="p-8">
	<h1 class="text-3xl font-bold mb-4">{app.name}</h1>
	<p>Tags: {app.tags.join(', ')}</p>
	<!-- Add more details as needed -->
</main>
