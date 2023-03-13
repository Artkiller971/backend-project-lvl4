import _ from 'lodash';
import fastify from 'fastify';

import init from '../server/plugin.js';
import { getTestData, prepareData, signIn } from './helpers/index.js';

describe('test labels crud', () => {
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

  it('get labels page', async () => {

    const unauthorizedResponse = await app.inject({
      method: 'GET',
      url: '/labels',
    });

    const authorizedResponse = await app.inject({
      method: 'GET',
      url: '/labels',
      cookies: cookie,
    });

    expect(unauthorizedResponse.statusCode).toBe(302);
    expect(authorizedResponse.statusCode).toBe(200);
  });

  it('create', async () => {

    const params = testData.labels.new;
    const response = await app.inject({
      method: 'POST',
      url: '/labels',
      cookies: cookie,
      payload: {
        data: params,
      },
    });

    expect(response.statusCode).toBe(302);
    const label = await models.label.query().findOne({ name: params.name});
    expect(label).toMatchObject(params);
  });

  it('update', async () => {
    const params = testData.labels.new;
    const { id } = await models.label.query().findOne({
      name: testData.labels.existing1.name
    });

    const updateResponse = await app.inject({
      method: 'PATCH',
      url: `/labels/${id}`,
      cookies: cookie,
      payload: {
        data: params,
      }
    });

    expect(updateResponse.statusCode).toBe(302);
    const updatedLabel = await models.label.query().findById(id);
    expect(updatedLabel).toMatchObject(params);
  });

  it('delete', async () => {
    const label1 = await models.label.query().findOne({
      name: testData.labels.existing1.name
    });

    const id1 = label1.id
    console.log(label1);

    const deleteResponse = await app.inject({
      method: 'DELETE',
      url: `/labels/${id1}`,
      cookies: cookie,
    });

    expect(deleteResponse.statusCode).toBe(302);
    const deletedLabel = await models.label.query().findById(id1);
    expect(deletedLabel).not.toBeUndefined();

    const label2 = await models.label.query().findOne({
      name: testData.labels.existing2.name
    });

    const id2 = label2.id

    const deleteResponse2 = await app.inject({
      method: 'DELETE',
      url: `/labels/${id2}`,
      cookies: cookie,
    })

    expect(deleteResponse2.statusCode).toBe(302);
    const deletedLabel2 = await models.label.query().findById(id2);
    expect(deletedLabel2).toBeUndefined();
  })

  afterEach(async () => {
    await knex.truncate('labels');
  });

  afterAll(async () => {
    await app.close();
  });
});
