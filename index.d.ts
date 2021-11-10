import { Adapter } from '@sveltejs/kit';

interface AdapterOptions {
	pages?: string;
    assets?: string;
    fallback?: string;
}

export const shortcodeTemplate: string

declare function plugin(options?: AdapterOptions): Adapter;
export = plugin;
