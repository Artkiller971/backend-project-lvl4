import path from 'path';
import { fileURLToPath } from 'url';

import Pug from 'pug';
import i18next from 'i18next';
import ru from './locales/ru.js'

import addRoutes from './routes/index.js';
import getHelpers from './helpers/index.js';

const __dirname = fileURLToPath(path.dirname(import.meta.url));

const setUpViews = (app) => {
  const helpers = getHelpers(app);
  app.register(import('@fastify/view'), {
    engine: {
      pug: Pug,
    },
    defaultContext: {
      ...helpers,
      assetPath: (filename) => `/assets/${filename}`,
    },
    includeViewExtensions : true,
    templates: path.join(__dirname, '..', 'server', 'views'),
  });
};

const setUpStaticAssets = (app) => {
  const pathPublic = path.join(__dirname, '..', 'dist');
  app.register(import('@fastify/static'), {
    root: pathPublic,
    prefix: '/assets/',
  });
}

const setUpLocalization = async () => {
  await i18next
    .init({
      lng: 'ru',
      fallbackLng: 'en',
      resources: {
        ru,
      },
    });
};

// eslint-disable-next-line no-unused-vars
export default async (app, options) => {
  await setUpLocalization();
  setUpViews(app);
  setUpStaticAssets(app);
  addRoutes(app);

  return app;
}