import path from 'path';
import { fileURLToPath } from 'url';

import Pug from 'pug';

import addRoutes from './routes/index.js';

const __dirname = fileURLToPath(path.dirname(import.meta.url));

const setUpViews = (app) => {
  app.register(import('@fastify/view'), {
    engine: {
      pug: Pug,
    },
    includeViewExtensions : true,
    templates: path.join(__dirname, '..', 'server', 'views'),
  });
}

// eslint-disable-next-line no-unused-vars
export default (app, options) => {
  setUpViews(app);
  addRoutes(app);

  return app;
}