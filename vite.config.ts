import { sveltekit } from '@sveltejs/kit/vite';
import { imagetools } from 'vite-imagetools';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { defineConfig } from 'vite';
export default defineConfig({
	plugins: [enhancedImages(), sveltekit(), imagetools()],
	// build: { minify: false },
	define: {
		'process.env.NODE_ENV': '"production"'
	},
	optimizeDeps: {
		exclude: ['@sveltekit-i18n/parser-icu', 'html2pdf.js', '@sveltekit-i18n/base']
	}
	// server: {
	// 	fs: {
	// 		allow: ['/files/*']
	// 	}
	// }
	// server: {
	//     host: true
	//   }
});
