import adapter from 'sveltekit-adapter-wordpress-shortcode'
import preprocess from 'svelte-preprocess'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),
	kit: {
		adapter: adapter(),
		prerender: {
			default: true
		}
	}
}

if (process.env.NODE_ENV === "production") {
    const base = "/wp-content/plugins/my-shortcode-plugin"
    config.kit.paths = {
        base,
        assets: "https://example.com" + base
    }
}

export default config;
