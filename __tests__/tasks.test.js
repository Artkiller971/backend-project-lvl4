import _ from 'lodash';
import fastify from 'fastify';

import init from '../server/plugin.js';
import { getTestData, prepareData, signIn } from './helpers/index.js';

describe('test tasks crud', () => {
  let app;
  let knex;
  let models;
  let cookie;
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
    cookie = await signIn(app, testData.users.existing1);
  });

  it('get tasks page', async () => {

    const unauthorizedResponse = await app.inject({
      method: 'GET',
      url: '/tasks',
    });

    const authorizedResponse = await app.inject({
      method: 'GET',
      url: '/tasks',
      cookies: cookie,
    });

    expect(unauthorizedResponse.statusCode).toBe(302);
    expect(authorizedResponse.statusCode).toBe(200);
  });

  it('create', async () => {

    const params = testData.tasks.new;
    const response = await app.inject({
      method: 'POST',
      url: '/tasks',
      cookies: cookie,
      payload: {
        data: params,
      },
    });

    expect(response.statusCode).toBe(302);
    const task = await models.task.query().findOne({ name: params.name});
    const data = _.omit(params, 'labels');
    expect(task).toMatchObject(data);
  });

  it('update', async () => {
    const params = testData.tasks.new;
    const { id } = await models.task.query().findOne({
      name: testData.tasks.existing.name
    });

    const updateResponse = await app.inject({
      method: 'PATCH',
      url: `/tasks/${id}`,
      cookies: cookie,
      payload: {
        data: params,
      }
    });

    expect(updateResponse.statusCode).toBe(302);
    const updatedTask = await models.task.query().findById(id);
    const data = _.omit(params, 'labels');
    expect(updatedTask).toMatchObject(data);
  });

  it('delete', async () => {
    const { id } = await models.task.query().findOne({
      name: testData.tasks.existing.name
    });

    const deleteResponse = await app.inject({
      method: 'DELETE',
      url: `/tasks/${id}`,
      cookies: cookie,
    });

    expect(deleteResponse.statusCode).toBe(302);
    const deletedTask = await models.task.query().findById(id);
    expect(deletedTask).toBeUndefined();
  })

  afterEach(async () => {
    await knex.truncate('tasks');
  });

  afterAll(async () => {
    await app.close();
  });
});
