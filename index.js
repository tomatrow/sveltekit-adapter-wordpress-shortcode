import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { join, resolve } from 'path'

/** @type {import('.')} */
export default function ({ pages = 'build', assets = pages, fallback = null, indexPath = "index.php", shortcode = "svelte-kit-shortcode" } = {}) {
	return {
		name: '@sveltejs/adapter-wordpress-shortcode',

		async adapt({ utils }) {
			utils.rimraf(assets)
			utils.rimraf(pages)

			utils.copy_static_files(assets)
			utils.copy_client_files(assets)

			await utils.prerender({
				fallback,
				all: !fallback,
				dest: pages
			})

            // copy index.php
            if (!existsSync(indexPath))
                throw new Error("No plugin index at " + indexPath)
            const content = readFileSync(indexPath, 'utf8')
            writeFileSync(resolve(pages, "index.php"), content)

            // read and remove index.html
            const indexHtmlPath = resolve(pages, "index.html")
            /** @type {string} */
            const indexHtml = readFileSync(indexHtmlPath, "utf8")
            utils.rimraf(indexHtmlPath)

            // fill in shortcode template
            const shortcodePath = "svelte_kit_shortcode.php"
            /** @type {string} */
            const shortcodeTemplate = readFileSync(join(fileURLToPath(new URL('./files', import.meta.url)), shortcodePath), "utf-8")
            const filledTemplate = shortcodeTemplate
                .replaceAll("%shortcode.code%", shortcode)
                .replace("%shortcode.head%", scan("head", indexHtml))
                .replace("%shortcode.body%", scan("body", indexHtml))
            writeFileSync(resolve(pages, shortcodePath), filledTemplate)
		}
	}
}

/** 
* @param {"head"|"body"} segment
* @param {string} indexHtml
*/
function scan(segment, indexHtml) {
    const literal = segment.toUpperCase()
    const start = `<!-- SHORTCODE ${literal} START -->`
    const end = `<!-- SHORTCODE ${literal} END -->`

    const matches = indexHtml.match(new RegExp(start + ".+?" + end, "gms"))
    const part = matches?.[0]
    
    if (!part) throw new Error(`Could not find ${segment}`)
    
    return part
}
