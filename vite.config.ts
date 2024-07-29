import { sveltekit } from '@sveltejs/kit/vite';
import { imagetools } from 'vite-imagetools';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { defineConfig } from 'vite';
export default defineConfig({
	plugins: [enhancedImages(), sveltekit(), imagetools()],
	build: { minify: false }
	// server: {
	// 	fs: {
	// 		allow: ['/files/*']
	// 	}
	// }
});
