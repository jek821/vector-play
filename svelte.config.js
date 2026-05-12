/** @type {import("@sveltejs/vite-plugin-svelte").SvelteConfig} */
export default {
    onwarn(warning, defaultHandler) {
        if (warning.code.startsWith('a11y')) return;
        defaultHandler(warning);
    }
}
