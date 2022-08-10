import { fileURLToPath } from "url"
import { readFileSync, writeFileSync } from "fs"
import { resolve } from "path"
import { JSDOM } from "jsdom"

const files = fileURLToPath(new URL('./files', import.meta.url).href);

/** @type {import('.')} */
export default function ({
	pages = "build",
	assets = pages,
	fallback = null,
	indexPath = "index.php",
	shadow = false,
	shortcode = "svelte-kit-shortcode",
	renderHead = head => 
		[...head.querySelectorAll(`link[rel="modulepreload"]`)]
			.map(element => element.outerHTML)
			.join("")
	,
	renderBody = body => body.innerHTML
} = {}) {
	return {
		name: "@sveltejs/adapter-wordpress-shortcode",

		async adapt(builder) {
			if (!fallback && !builder.config.kit.prerender.default) 
				builder.log.warn(
					'You should set `config.kit.prerender.default` to `true` if no fallback is specified'
				)

			if (!builder.config.kit.paths.base)
				builder.log.warn(
					"You should set config.kit.paths.base to something like `/wp-content/plugins/my-shortcode-plugin`"
				)
			
			if (!builder.config.kit.paths.assets)
				builder.log.warn(
					"You should set config.kit.paths.assets to something like `https://example.com/wp-content/plugins/my-shortcode-plugin`"
				)

			builder.rimraf(assets)
			builder.rimraf(pages)

			builder.writeClient(assets)
			builder.writePrerendered(pages, { fallback })

			// copy php files
			builder.copy(indexPath, resolve(pages, "index.php"))
			builder.copy(files, pages, {
				replace: {
					SHORTCODE_CODE: shortcode,
					SHORTCODE_SHADOW: String(shadow)
				}
			})

			// read, remove, and transform index.html
			const indexHtmlPath = resolve(pages, "index.html")
			const dom = new JSDOM(readFileSync(indexHtmlPath, "utf8"))
			builder.rimraf(indexHtmlPath)
			writeFileSync(resolve(pages, "svelte_kit_shortcode_head.html"), renderHead(dom.window.document.head))
			writeFileSync(resolve(pages, "svelte_kit_shortcode_body.html"), renderBody(dom.window.document.body))

			if (pages === assets) 
				builder.log(`Wrote site to "${pages}"`)
			 else 
				builder.log(`Wrote pages to "${pages}" and assets to "${assets}"`)
		}
	}
}
