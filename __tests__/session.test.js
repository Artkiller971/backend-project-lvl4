import _ from 'lodash';
import fastify from 'fastify';

import init from '../server/plugin.js';
import { getTestData, prepareData, signIn } from './helpers/index.js';

describe('test session', () => {
  let app;
  let knex;
  let models;
  const testData = getTestData();

  beforeAll(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      logger: {
        transport: {
          target: 'pino-pretty'
        }
      },
    });
    await init(app);
    knex = app.objection.knex;
    models = app.objection.models;

    await knex.migrate.latest();
    await prepareData(app);
  });

  it(' sign in / sign out', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/session/new',
    });

    expect(res.statusCode).toBe(200);

    const signInResponse = await app.inject({
      method: 'POST',
      url: '/session',
      payload: {
        data: testData.users.existing,
      },
    });

    expect(signInResponse.statusCode).toBe(302);

    const [sessionCookie] = signInResponse.cookies;
    const { name, value } = sessionCookie;
    const cookie = { [name]: value };

    const signOutResponse = await app.inject({
      method: 'DELETE',
      url: '/session',
      cookies: cookie,
    });

    expect(signOutResponse.statusCode).toBe(302);
  })

  afterAll(async () => {
    await knex.truncate('users');
    await app.close();
  });
});