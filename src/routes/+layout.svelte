<script>
	import '../app.css';
	import { initAuth } from '../lib/firebase/authService';

	// Initialize Firebase authentication
	console.log('Calling initAuth from +layout.svelte');
	initAuth();
</script>

<slot />
