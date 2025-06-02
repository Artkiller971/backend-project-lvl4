import {
  describe, beforeAll, it, expect,
} from '@jest/globals';

import fastify from 'fastify';

import init from '../server/plugin.js';
import { getTestData, prepareData } from './helpers/index.js';

describe('test labels CRUD', () => {
  let app;
  let knex;
  let models;
  let cookie;
  const testData = getTestData();

  beforeAll(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      logger: { target: 'pino-pretty' },
    });
    await init(app);
    knex = app.objection.knex;
    models = app.objection.models;
  });

  beforeEach(async () => {
    await knex.migrate.latest();
    await prepareData(app);

    const params = testData.users.existing;
    const responseSignIn = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: {
        data: params,
      },
    });

    const [sessionCookie] = responseSignIn.cookies;
    const { name, value } = sessionCookie;
    cookie = { [name]: value };
  });

  it('index', async () => {
    const noCookieResponse = await app.inject({
      method: 'GET',
      url: app.reverse('labels'),
    });

    expect(noCookieResponse.statusCode).toBe(302);

    const cookieResponse = await app.inject({
      method: 'GET',
      url: app.reverse('labels'),
      cookies: cookie,
    });

    expect(cookieResponse.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newLabel'),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const params = testData.labels.new;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('labels'),
      payload: {
        data: params,
      },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    const label = await models.label.query().findOne({ name: params.name });
    expect(label).toMatchObject(params);
  });

  it('edit', async () => {
    const params = testData.labels.existing;
    const label = await models.label.query().findOne({ name: params.name });

    const newParams = { ...params, name: 'Changed' };

    const responseEdit = await app.inject({
      method: 'PATCH',
      url: app.reverse('labelEdit', { id: label.id }),
      payload: {
        data: newParams,
      },
      cookies: cookie,
    });

    expect(responseEdit.statusCode).toBe(302);

    const updatedLabel = await models.label.query().findOne({ name: newParams.name });

    expect(updatedLabel.name).toBe('Changed');
  });

  it('delete no realtions', async () => {
    const params = testData.labels.existing2;

    const label = await models.label.query().findOne({ name: params.name });

    const responseDelete = await app.inject({
      method: 'DELETE',
      url: app.reverse('labelDelete', { id: label.id }),
      cookies: cookie,
    });

    expect(responseDelete.statusCode).toBe(302);

    const deletedLabel = await models.label.query().findOne({ name: params.name });

    expect(deletedLabel).toBeUndefined();
  });

  it('delete with relations', async () => {
    const params = testData.labels.existing;

    const label = await models.label.query().findOne({ name: params.name });

    const responseDelete = await app.inject({
      method: 'DELETE',
      url: app.reverse('labelDelete', { id: label.id }),
      cookies: cookie,
    });

    expect(responseDelete.statusCode).toBe(302);

    const deletedLabel = await models.label.query().findOne({ name: params.name });

    expect(deletedLabel).toMatchObject(label);
  });

  afterEach(async () => {
    await knex.migrate.rollback();
  });

  afterAll(async () => {
    await app.close();
  });
});
