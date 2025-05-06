import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fastifyView from '@fastify/view';
import fastifyStatic from '@fastify/static';
import { plugin as fastifyReverseRoutes } from 'fastify-reverse-routes';
// import fastifyMethodOverride from 'fastify-method-override';
import fastifyFormbody from '@fastify/formbody';
import Pug from 'pug';
import qs from 'qs';

import addRoutes from './routes/index.js';

const __dirname = fileURLToPath(path.dirname(import.meta.url));

// const mode = process.env.NODE_ENV || 'development';

const setUpStaticAssets = async (app) => {
  const pathPublic = path.join(__dirname, '..', 'dist');
  app.register(fastifyStatic, {
    root: pathPublic,
    prefix: '/assets/',
  });
};

const setUpViews = async (app) => {
  app.register(fastifyView, {
    engine: {
      pug: Pug,
    },
    includeViewExtension: true,
    defaultContext: {
      assetPath: (filename) => `/assets/${filename}`,
    },
    templates: path.join(__dirname, '..', 'server', 'views'),
  });

  app.decorateReply('render', function render(viewPath, locals) {
    this.view(viewPath, { ...locals, reply: this });
  });
};

const registerPlugins = async (app) => {
  await app.register(fastifyReverseRoutes);
  await app.register(fastifyFormbody, { parser: qs.parse });
  //await app.register(fastifyMethodOverride);
};

// eslint-disable-next-line no-unused-vars
export default async (app, options) => {
  await registerPlugins(app);

  setUpViews(app);
  setUpStaticAssets(app);
  addRoutes(app);

  return app;
};
