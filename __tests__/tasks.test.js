import {
  describe, beforeAll, it, expect,
} from '@jest/globals';

import fastify from 'fastify';

import init from '../server/plugin.js';
import { getTestData, prepareData } from './helpers/index.js';

describe('test tasks CRUD', () => {
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
      url: app.reverse('tasks'),
    });

    expect(noCookieResponse.statusCode).toBe(302);

    const cookieResponse = await app.inject({
      method: 'GET',
      url: app.reverse('tasks'),
      cookies: cookie,
    });

    expect(cookieResponse.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newTask'),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const params = testData.tasks.new;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('tasks'),
      payload: {
        data: params,
      },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    const task = await models.task.query().findOne({ name: params.name });
    expect(task).toMatchObject(params);
  });

  it('create with multiple labels', async () => {
    const params = testData.tasks.multipleLabels;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('tasks'),
      payload: {
        data: params,
      },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    const task = await models.task
      .query()
      .withGraphJoined('labels')
      .where('tasks.name', params.name);

    expect(task[0].labels).toHaveLength(3);
  });

  it('edit', async () => {
    const params = testData.tasks.existing;
    const task = await models.task.query().findOne({ name: params.name });

    const newParams = { ...params, name: 'Changed' };

    const responseEdit = await app.inject({
      method: 'PATCH',
      url: app.reverse('taskEdit', { id: task.id }),
      payload: {
        data: newParams,
      },
      cookies: cookie,
    });

    expect(responseEdit.statusCode).toBe(302);

    const updatedTask = await models.task.query().findOne({ name: newParams.name });

    expect(updatedTask.name).toBe('Changed');
  });

  it('edit multiple labels', async () => {
    const params = testData.tasks.multipleLabelsExisting;
    const task = await models.task.query().findOne({ name: params.name });

    const newParams = { ...params, labels: ['1', '2'] };

    const responseEdit = await app.inject({
      method: 'PATCH',
      url: app.reverse('taskEdit', { id: task.id }),
      payload: {
        data: newParams,
      },
      cookies: cookie,
    });

    expect(responseEdit.statusCode).toBe(302);

    const updatedTask = await models.task
      .query()
      .where('tasks.name', params.name)
      .withGraphFetched('labels');

    expect(updatedTask[0].labels).toHaveLength(2);
  });

  it('delete', async () => {
    const params = testData.tasks.existing;

    const task = await models.task.query().findOne({ name: params.name });

    const responseDelete = await app.inject({
      method: 'DELETE',
      url: app.reverse('taskDelete', { id: task.id }),
      cookies: cookie,
    });

    expect(responseDelete.statusCode).toBe(302);

    const deletedTask = await models.task.query().findOne({ name: params.name });

    expect(deletedTask).toBeUndefined();
  });

  afterEach(async () => {
    await knex('tasks').truncate();
  });

  afterAll(async () => {
    await app.close();
  });
});
