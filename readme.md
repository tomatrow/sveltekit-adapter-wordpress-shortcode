# sveltekit-adapter-wordpress-shortcode

[Adapter](https://kit.svelte.dev/docs#adapters) for SvelteKit which turns your app into a wordpress shortcode.

## Usage

Install with `npm i -D sveltekit-adapter-wordpress-shortcode`, then add the adapter to your `svelte.config.js`, and set the kit template to `shortcodeTemplate` in production. It's likely you will need to set custom base paths for production also.

```js
// svelte.config.js
import adapter, { shortcodeTemplate } from 'sveltekit-adapter-wordpress-shortcode';

const production = process.env.NODE_ENV === "production"

/** @type {import('@sveltejs/kit').Config["kit"]["paths"]} */
let paths 
/** @type {import('@sveltejs/kit').Config["kit"]["files"]["template"]} */
let template 
if (production) {
    const base = "/wp-content/plugins/svelte-kit-shortcode-plugin"
    paths = {
        base,
        assets: process.env.VITE_BASE_URL + base
    }
    template = shortcodeTemplate
}

export default {
    kit: {
        files: {
            template
        },
        adapter: adapter(),
        paths
    }
}
```

## License

[MIT](LICENSE)