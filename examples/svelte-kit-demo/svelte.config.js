import adapter from 'sveltekit-adapter-wordpress-shortcode'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter()
	}
}

export default config;
