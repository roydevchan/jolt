const fs = require('fs');
const path = require('path');
const bundleRunner = require('./bundle-runner');
const express = require('express');
const { renderPreloadLinks } = require('./preload-links');

const isProd = process.env.NODE_ENV === 'production';
const projectRoot = path.resolve(__dirname, '..');

const buildDir = path.join(projectRoot, 'build');
const serverBuildPath = path.join(buildDir, 'server');
const webBuildPath = path.join(buildDir, 'web');

// This is the output of build:client.
// The server will render the vue app for incoming requests and interpolate it
// into the index.html before serving out.
const indexHtmlTemplate = fs.readFileSync(path.join(webBuildPath, 'index.html'), 'utf-8');

// The SSR manifest holds mappings of vue component => assets that are in use.
// Similarly to index.html and assets, it is generated with build:client (its the --ssrManifest flag)
// As the server renders the app, it keeps track of which components it rendered.
// We use this to figure out the smallest list of assets we need to preload on the client side
// in order to hydrate it.
const ssrManifest = require(path.join(webBuildPath, 'ssr-manifest.json'));

// This is the output of build:server, and is the entry point for the ssr request.
// We read it as string instead of requiring because we only want to evaluate it within
// a new node context, and its more efficient reading it from disk once and copying it
// over to the new node context than to read it from disk for every request.
const serverBundleFile = path.join(serverBuildPath, 'server.js');
// const serverVMScript = bundleRunner.getPreparedScript(serverBundleFile);
const serverBundle = bundleRunner.compileModule(serverBundleFile);

const server = express();

// Only needed in dev builds, in prod everything would be served from cdn.
if (!isProd) {
	server.use(
		express.static(webBuildPath, {
			index: false,
		})
	);

	server.use('/favicon.ico', (req, res) => {
		res.status(404).end();
	});
}

// TODO: refactor this into somewhere else.

server.use(async (req, res) => {
	try {
		const context = {
			url: req.url,
			ua: req.headers['user-agent'],
			accept: req.headers['accept'] || '',
		};

		console.log(context);

		const s = Date.now();
		// const vm = bundleRunner.getNewContext();
		// const createApp = vm.run(serverVMScript).default;

		// const app = await createApp(context);

		// console.log('created app');

		// passing SSR context object which will be available via useSSRContext()
		// @vitejs/plugin-vue injects code into a component's setup() that registers
		// itself on renderCtx.modules. After the render, renderCtx.modules would contain all the
		// components that have been instantiated during this render call.
		// vm.sandbox.app = app;
		// vm.sandbox.context = context;
		// vm.sandbox.serverBundleFile = serverBundleFile;
		// const renderFunc = vm.run(
		// 	`
		// 	module.exports = async function () {
		// 		const createApp = require(serverBundleFile).default;
		// 		const app = await createApp(context);

		// 		const { renderToString } = require('vue/server-renderer');
		// 		const renderCtx = {};
		// 		const appHtml = await renderToString(app, renderCtx);
		// 		return [appHtml, renderCtx];
		// 	};
		// `,
		// 	path.resolve(path.join(__dirname, 'server-sandbox.js'))
		// );

		// const [appHtml, renderCtx] = await renderFunc();
		const createApp = serverBundle();
		const [appHtml, renderCtx] = await createApp(context);

		// the SSR manifest generated by Vite contains module -> chunk/asset mapping
		// which we can then use to determine what files need to be preloaded for this
		// request.
		const preloadLinks = renderPreloadLinks(renderCtx.modules, ssrManifest);

		const html = indexHtmlTemplate
			.replace(`<!-- ssr-preload-links -->`, preloadLinks)
			.replace(`<!-- ssr-outlet -->`, appHtml)
			.replace(`<!-- gj:ssr-metatags -->`, context.meta.renderTags());

		if (context.redirect) {
			console.log('sending redirect', context.redirect);
			res.redirect(301, context.redirect);
			return;
		} else if (context.errorCode) {
			console.log('sending error code', context.errorCode);
			res.status(context.errorCode);
		} else {
			res.status(200);
		}

		res.set({ 'Content-Type': 'text/html' }).end(html, () => {
			const total = Date.now() - s;
			console.log(
				'response ended',
				'total time:',
				total + 'ms',
				'render time:',
				total - context.prefetchTime + 'ms',
				req.url,
				req.headers['host'],
				req.headers['user-agent']
			);
		});

		console.log('request ending');
	} catch (e) {
		console.log('got error', req.url, e);
		res.status(500).end('Internal Server Error');
	}
});

const port = 3501;
server.listen(port, () => {
	console.log(`server started at localhost:${port}`);
});