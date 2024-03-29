import _ from 'lodash';
import fastify from 'fastify';

import init from '../server/plugin.js';
import { getTestData, prepareData, signIn } from './helpers/index.js';

describe('test statuses crud', () => {
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

  it('get statuses page', async () => {

    const unauthorizedResponse = await app.inject({
      method: 'GET',
      url: '/statuses',
    });

    const authorizedResponse = await app.inject({
      method: 'GET',
      url: '/statuses',
      cookies: cookie,
    });

    expect(unauthorizedResponse.statusCode).toBe(302);
    expect(authorizedResponse.statusCode).toBe(200);
  });

  it('create', async () => {

    const params = testData.statuses.new;
    const response = await app.inject({
      method: 'POST',
      url: '/statuses',
      cookies: cookie,
      payload: {
        data: params,
      },
    });

    expect(response.statusCode).toBe(302);
    const taskStatus = await models.taskStatus.query().findOne({ name: params.name});
    expect(taskStatus).toMatchObject(params);
  });

  it('update', async () => {
    const params = testData.statuses.new;
    const { id } = await models.taskStatus.query().findOne({
      name: testData.statuses.existing1.name
    });

    const updateResponse = await app.inject({
      method: 'PATCH',
      url: `/statuses/${id}`,
      cookies: cookie,
      payload: {
        data: params,
      }
    });

    expect(updateResponse.statusCode).toBe(302);
    const updatedStatus = await models.taskStatus.query().findById(id);
    expect(updatedStatus).toMatchObject(params);
  });

  it('delete', async () => {
    const status1 = await models.taskStatus.query().findOne({
      name: testData.statuses.existing1.name
    })
    const id1 = status1.id;

    const deleteResponse = await app.inject({
      method: 'DELETE',
      url: `/statuses/${id1}`,
      cookies: cookie,
    });

    expect(deleteResponse.statusCode).toBe(302);
    const deletedStatus = await models.taskStatus.query().findById(id1);
    expect(deletedStatus).not.toBeUndefined();

    const status2 = await models.taskStatus.query().findOne({
      name: testData.statuses.existing2.name
    });

    const id2 = status2.id

    const deleteResponse2 = await app.inject({
      method: 'DELETE',
      url: `/statuses/${id2}`,
      cookies: cookie,
    });

    expect(deleteResponse2.statusCode).toBe(302);
    const deletedStatus2 = await models.taskStatus.query().findById(id2);
    expect(deletedStatus2).toBeUndefined();
  })

  afterEach(async () => {
    await knex.truncate('statuses');
  });

  afterAll(async () => {
    await app.close();
  });
});
