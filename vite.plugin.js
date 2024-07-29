/* eslint-disable @typescript-eslint/ban-ts-comment */
import express from 'express';
const assets = express.static('uploads');
// @ts-ignore
const configureServer = (server) => {
	server.middlewares.use(assets);
};
export const vitePlugin = () => ({
	name: 'vite-plugin',
	configureServer,

	configurePreviewServer: configureServer
});
