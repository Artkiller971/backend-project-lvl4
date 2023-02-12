import path from 'path';
import { fileURLToPath } from 'url';

import Pug from 'pug';
import i18next from 'i18next';
import ru from './locales/ru.js';
import qs from 'qs';

import fastifyStatic from '@fastify/static';
import fastifyView from '@fastify/view';
import fastifyFormbody from '@fastify/formbody';
import fastifySecureSession from '@fastify/secure-session';
import fastifyPassport from '@fastify/passport';
import fastifySensible from '@fastify/sensible';
import { plugin as fastifyReverseRoutes } from 'fastify-reverse-routes';
import fastifyMethodOverride from 'fastify-method-override';
import fastifyObjectionjs from 'fastify-objectionjs';

import addRoutes from './routes/index.js';
import getHelpers from './helpers/index.js';
import * as knexConfig from '../knexfile.js';
import models from './models/index.js';
import FormStrategy from './lib/passportStrategies/FormStrategy.js';


const __dirname = fileURLToPath(path.dirname(import.meta.url));

const mode = process.env.NODE_ENV || 'development';

const setUpViews = (app) => {
  const helpers = getHelpers(app);
  app.register(fastifyView, {
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
  await app.register(fastifyPassport.initialize());
  await app.register(fastifyPassport.secureSession());
  fastifyPassport.registerUserSerializer((user) => Promise.resolve(user));
  fastifyPassport.registerUserDeserializer((user) => app.objection.models.user.query().findById(user.id));
  fastifyPassport.use(new FormStrategy('form', app));
  await app.decorate('fp', fastifyPassport);
  await app.decorate('authenticate', (...args) => fastifyPassport.authenticate(
    'form',
    {
      failureRedirect: '/',
      failureFlash: i18next.t('flash.authError'),
    },
  )(...args));

  await app.register(fastifyMethodOverride);
  await app.register(fastifyObjectionjs, {
    knexConfig: knexConfig[mode],
    models,
  });

};

// eslint-disable-next-line no-unused-vars
export default async (app, options) => {
  await registerPlugins(app);

  await setUpLocalization();
  setUpViews(app);
  setUpStaticAssets(app);
  addRoutes(app);
  addHooks(app);

  return app;
}