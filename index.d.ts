import { Adapter } from "@sveltejs/kit"

interface AdapterOptions {
	pages?: string
	assets?: string
	fallback?: string
	indexPath?: string
	shortcode?: string
	shadow?: boolean
	renderHead?: (head: HTMLHeadElement) => string
	renderBody?: (head: HTMLBodyElement) => string
}

declare function plugin(options?: AdapterOptions): Adapter
export = plugin
