<script>
	import { onMount } from 'svelte'

	let counter = 0

	onMount(() => {
		const interval = setInterval(() => counter = counter + 1, 1000)
		return () => clearInterval(interval)
	})
	console.log("Hello")
</script>

<h1>Welcome to SvelteKit {counter}</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
