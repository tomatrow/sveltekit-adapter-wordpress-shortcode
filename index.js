import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { join, resolve } from 'path';

// @ts-ignore
const filesPath = fileURLToPath(new URL('./files', import.meta.url))

export const shortcodeTemplate = join(filesPath, "shortcode.php.part")

/** @type {import('.')} */
export default function ({ pages = 'build', assets = pages, fallback = null } = {}) {
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

            const indexHtmlPath = resolve(pages, "index.html")
            const template = readFileSync(indexHtmlPath, "utf-8")
            
            const userPluginIndexPath = "index.php"

            const resolvedPluginIndexPath = existsSync(userPluginIndexPath) ? userPluginIndexPath : join(filesPath, "index.php")
            
            const pluginIndex = readFileSync(resolvedPluginIndexPath, "utf-8")
            
            writeFileSync(resolve(pages, "index.php"), pluginIndex + "\n" + template)

            utils.rimraf(indexHtmlPath)
		}
	};
}

