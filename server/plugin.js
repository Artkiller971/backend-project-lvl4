import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fastifyView from '@fastify/view';
import fastifyStatic from '@fastify/static';
import { plugin as fastifyReverseRoutes } from 'fastify-reverse-routes';
import fastifyMethodOverride from 'fastify-method-override';
import fastifyFormbody from '@fastify/formbody';
import fastifyObjectionjs from 'fastify-objectionjs';
import fastifySecureSession from '@fastify/secure-session';
import fastifyPassport from '@fastify/passport';
import fastifySensible from '@fastify/sensible';
import Pug from 'pug';
import qs from 'qs';
import i18next from 'i18next';
import Rollbar from 'rollbar';

import addRoutes from './routes/index.js';
import getHelpers from './helpers/helpers.js';
import * as knexConfig from '../knexfile.js';
import models from './models/index.js';
import FormStrategy from './lib/passportStrategies/FromStrategy.js';
import ru from './locales/ru.js';
import en from './locales/en.js';

const __dirname = fileURLToPath(path.dirname(import.meta.url));

const mode = process.env.NODE_ENV || 'development';

const rollbar = new Rollbar({
  accessToken: process.env.ACCESS_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
});

const setErrorHandler = (app) => {
  rollbar.log('Setting up rollbar');

  app.setErrorHandler = (error, req, reply) => {
    const errorMessage = reply.statusCode === 500 ? 'Internal server error' : error.message;

    req.log(errorMessage);
    if (mode === 'production') {
      rollbar.log(error);
    }

    req.flash('error', errorMessage);
    reply.redirect('/');
  };
};

const setUpViews = (app) => {
  const helpers = getHelpers(app);

  app.register(fastifyView, {
    engine: {
      pug: Pug,
    },
    includeViewExtension: true,
    defaultContext: {
      ...helpers,
      assetPath: (filename) => `/assets/${filename}`,
    },
    templates: path.join(__dirname, '..', 'server', 'views'),
  });

  app.decorateReply('render', function render(viewPath, locals) {
    this.view(viewPath, { ...locals, reply: this });
  });
};

const setUpStaticAssets = (app) => {
  const pathPublic = path.join(__dirname, '..', 'dist');
  app.register(fastifyStatic, {
    root: pathPublic,
    prefix: '/assets/',
  });
};

const setupLocalization = async () => {
  await i18next
    .init({
      lng: 'en',
      fallbackLng: 'ru',
      // debug: isDevelopment,
      resources: {
        ru,
        en,
      },
    });
};

const addHooks = (app) => {
  app.addHook('preHandler', async (req, reply) => {
    reply.locals = {
      isAuthenticated: () => req.isAuthenticated(),
    };
  });
};

const registerPlugins = async (app) => {
  await app.register(fastifySensible);
  await app.register(fastifyReverseRoutes);
  await app.register(fastifyFormbody, { parser: qs.parse });
  await app.register(fastifySecureSession, {
    secret: process.env.SESSION_KEY,
    cookie: {
      path: '/',
    },
  });

  fastifyPassport.registerUserDeserializer(
    (user) => app.objection.models.user.query().findById(user.id)
  );
  fastifyPassport.registerUserSerializer((user) => Promise.resolve(user));
  fastifyPassport.use(new FormStrategy('form', app));
  await app.register(fastifyPassport.initialize());
  await app.register(fastifyPassport.secureSession());
  await app.decorate('fp', fastifyPassport);
  app.decorate('authenticate', (...args) => fastifyPassport.authenticate(
    'form',
    {
      failureRedirect: app.reverse('root'),
      failureFlash: i18next.t('flash.authError'),
    }
  )(...args));

  await app.register(fastifyMethodOverride);
  await app.register(fastifyObjectionjs, {
    knexConfig: knexConfig[mode],
    models,
  });

  app.decorate('userCanEditProfile', async (req, reply) => {
    if (req.user.id !== parseInt(req.params.id, 10)) {
      req.flash('error', i18next.t('flash.users.authError'));
      reply.redirect(app.reverse('users'));
    }
  });
};

export const options = {
  exposeHeadRoutes: false,
};

// eslint-disable-next-line no-unused-vars
export default async (app, _options) => {
  await registerPlugins(app);

  await setupLocalization();

  setUpViews(app);
  setUpStaticAssets(app);
  addRoutes(app);
  addHooks(app);
  setErrorHandler(app);

  return app;
};
