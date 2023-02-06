import _ from 'lodash';
import fastify from 'fastify';

import init from '../server/plugin.js';
import encrypt from '../server/lib/secure.cjs';
import { getTestData, prepareData, signIn } from './helpers/index.js';

describe('test users CRUD', () => {
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
  });

  beforeEach(async () => {
    await knex.migrate.latest();
    await prepareData(app);
  });

  it('index', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/users',
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/users/new',
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const params = testData.users.new;
    const response = await app.inject({
      method: 'POST',
      url: '/users',
      payload: {
        data: params,
      },
    });

    expect(response.statusCode).toBe(302);
    const expected = {
      ..._.omit(params, 'password'),
      passwordDigest: encrypt(params.password),
    };
    const user = await models.user.query().findOne({ email: params.email });
    expect(user).toMatchObject(expected);
  });

  it('update', async () => {
    const cookie = await signIn(app, testData.users.existing);
    const { id } = await models.user.query().findOne({ email: testData.users.existing.email});
    const params = testData.users.new;

    const updateResponse = await app.inject({
      method: 'PATCH',
      url: `/users/${id}`,
      cookies: cookie,
      payload: {
        data: params,
      },
    });

    expect(updateResponse.statusCode).toBe(302);
    const updatedUser = await models.user.query().findById(id);
    const expected = {
      ..._.omit(params, 'password'),
      passwordDigest: encrypt(params.password),
    };
    expect(updatedUser).toMatchObject(expected);

  });

  it('delete', async () => {
    const cookie = await signIn(app, testData.users.existing);
    const { id } = await models.user.query().findOne({ email: testData.users.existing.email });

    const deleteResponse = await app.inject({
      method: 'DELETE',
      url: `/users/${id}`,
      cookies: cookie,
    });

    expect(deleteResponse.statusCode).toBe(302);
    const deletedUser = await models.user.query().findById(id);
    expect(deletedUser).toBeUndefined();
  })

  afterEach(async () => {
    await knex.truncate('users');
  });

  afterAll(async () => {
    await app.close();
  });
});