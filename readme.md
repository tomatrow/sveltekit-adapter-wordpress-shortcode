# sveltekit-adapter-wordpress-shortcode (SKAWPSC)

[Adapter](https://kit.svelte.dev/docs#adapters) for SvelteKit which turns your app into a wordpress shortcode.

## Usage

Install with `npm i -D sveltekit-adapter-wordpress-shortcode`, setup the adapter in `svelte.config.js`, add `index.php` to the project root, and mark the parts of your template you want to include in the shortcode.

### Example `svelte.config.js`

Note: It's likely you will need to set custom base paths for Wordpress.

```js
// svelte.config.js
import adapter from "sveltekit-adapter-wordpress-shortcode"

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// all the default options
		adapter: adapter({
			pages: "build",
			assets: "build",
			fallback: null,
			indexPath: "index.php",
			shadow: false,
			shortcode: "svelte-kit-shortcode",
			prefix: "skawpsc_svelte_kit_shortcode",
			renderHead: head =>
				[...head.querySelectorAll(`link[rel="modulepreload"]`)]
					.map(element => element.outerHTML)
					.join(""),
			renderBody: body => body.innerHTML
		})
	}
}

// handle wordpress url structure
if (process.env.NODE_ENV === "production") {
	const base = "/wp-content/plugins/my-shortcode-plugin"
	config.kit.paths = {
		base,
		assets: "https://example.com" + base
	}
}

export default config
```

### Example `index.php`

Note: You can choose the path by setting `indexPath` in the adapter config.

```php
<!-- index.php -->
<?php
/**
 * Plugin Name: My Shortcode
 */

include plugin_dir_path( __FILE__ ) . 'svelte_kit_shortcode.php';
?>
```

### Passing attributes and content

Both are inserted right before the svelte kit body.

```html
[my-shortcode attribute-a attribute-b attribute-c]
<a href="/">Home</a>
[/my-shortcode]
```

becomes

```html
<script id="my-shortcode-attributes" type="application/json">
	["attribute-a", "attribute-b", "attribute-c"]
</script>
<template id="my-shortcode-content">
	<a href="/">Home</a>
</template>
<!-- svelte kit body stuff -->
```

## Style Isolation

### (1) Shadow dom

Setting the `shadow` option to true puts the head, body, and shortcode data under one shadow dom.

### or (2) Postcss

The following configuration of `postcss` plugins should provide enough isolation from Wordpress styles.

Note that `postcss-autoreset` is using the fork at `tomatrow/postcss-autoreset`.

```js
const autoprefixer = require("autoprefixer")
const cssnano = require("cssnano")
const safeImportant = require("postcss-safe-important")
const prefixer = require("postcss-prefix-selector")
const initial = require("postcss-initial")
const autoReset = require("postcss-autoreset")

const mode = process.env.NODE_ENV
const dev = mode === "development"

const config = {
	plugins: [
		autoReset({ reset: "revert" }),
		initial(),
		prefixer({
			prefix: "#svelte",
			transform(prefix, selector, prefixedSelector) {
				return ["html", "body"].includes(selector) ? `${selector} ${prefix}` : prefixedSelector
			}
		}),
		autoprefixer(),
		safeImportant(),
		!dev &&
			cssnano({
				preset: "default"
			})
	]
}

module.exports = config
```

## License

[MIT](LICENSE)
