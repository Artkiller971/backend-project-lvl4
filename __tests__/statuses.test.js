import {
  describe, beforeAll, it, expect,
} from '@jest/globals';

import fastify from 'fastify';

import init from '../server/plugin.js';
import { getTestData, prepareData } from './helpers/index.js';

describe('test statuses CRUD', () => {
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
      url: app.reverse('statuses'),
    });

    expect(noCookieResponse.statusCode).toBe(302);

    const cookieResponse = await app.inject({
      method: 'GET',
      url: app.reverse('statuses'),
      cookies: cookie,
    });

    expect(cookieResponse.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newStatus'),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const params = testData.statuses.new;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('statuses'),
      payload: {
        data: params,
      },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    const expected = {
      name: 'Done',
    };
    const status = await models.status.query().findOne({ name: params.name });
    expect(status).toMatchObject(expected);
  });

  it('edit', async () => {
    const params = testData.statuses.existing;
    const status = await models.status.query().findOne({ name: params.name });

    const newParams = { name: 'Changed' };

    const responseEdit = await app.inject({
      method: 'PATCH',
      url: app.reverse('statusEdit', { id: status.id }),
      payload: {
        data: newParams,
      },
      cookies: cookie,
    });

    expect(responseEdit.statusCode).toBe(302);

    const updatedStatus = await models.status.query().findOne({ name: newParams.name });

    expect(updatedStatus.name).toBe('Changed');
  });

  it('delete', async () => {
    const params = testData.statuses.existing;

    const status = await models.status.query().findOne({ name: params.name });

    const responseDelete = await app.inject({
      method: 'DELETE',
      url: app.reverse('statusDelete', { id: status.id }),
      cookies: cookie,
    });

    expect(responseDelete.statusCode).toBe(302);

    const deletedStatus = await models.status.query().findOne({ name: params.name });

    expect(deletedStatus).toBeUndefined();
  });

  afterEach(async () => {
    await knex.migrate.rollback();
  });

  afterAll(async () => {
    await app.close();
  });
});
