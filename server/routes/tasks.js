import i18next from 'i18next';
import { ValidationError } from 'objection';

export default (app) => {
  app
    .get('/tasks', { name: 'tasks', preValidation: app.authenticate }, async (req, reply) => {
      const { query } = req;
      const currentUserId = query.isCreatorUser ? req.user.id : '';

      const tasks = await app.objection.models.task
        .query()
        .withGraphJoined('[status, creator, executor, labels]')
        .modify('filterByStatus', query.status)
        .modify('filterByExecutor', query.executor)
        .modify('filterByLabel', query.label)
        .modify('filterOwn', currentUserId);

      const task = new app.objection.models.task();
      const statuses = await app.objection.models.status.query();
      const users = await app.objection.models.user.query();
      const labels = await app.objection.models.label.query();

      reply.render('tasks/index', {
        tasks, task, statuses, users, labels, query,
      });
      return reply;
    })
    .get('/tasks/new', { name: 'newTask' }, async (req, reply) => {
      const task = new app.objection.models.task();
      const statuses = await app.objection.models.status.query();
      const users = await app.objection.models.user.query();
      const labels = await app.objection.models.label.query();
      reply.render('tasks/new', {
        task, statuses, users, labels,
      });
      return reply;
    })
    .get('/tasks/:id/edit', { name: 'editTask', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;

      const task = await app.objection.models.task.query().findById(id);
      const statuses = await app.objection.models.status.query();
      const users = await app.objection.models.user.query();
      const labels = await app.objection.models.label.query();

      if (!task) {
        reply.send('Task does not exist');
        return reply;
      }
      reply.render('tasks/edit', {
        task, statuses, users, labels,
      });
      return reply;
    })
    .get('/tasks/:id', { name: 'showTask' }, async (req, reply) => {
      const task = await app.objection.models.task.query().findById(req.params.id).withGraphJoined('[status, creator, executor, labels]');
      reply.render('tasks/show', { task });
      return reply;
    })
    .patch('/tasks/:id', { name: 'taskEdit', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;

      try {
        const task = await app.objection.models.task.query().findById(id);
        const { creatorId } = task;
        const {
          name, description, executorId, statusId, labels = [],
        } = req.body.data;
        const mappedLabels = [...labels].flatMap((item) => ({ id: parseInt(item, 10) }));
        await task.$transaction(async (trx) => {
          await app.objection.models.task.query(trx).upsertGraph(
            {
              id: parseInt(req.params.id, 10),
              name,
              description,
              creatorId,
              executorId: parseInt(executorId, 10) || null,
              statusId: parseInt(statusId, 10),
              labels: mappedLabels,
            },
            { relate: true, unrelate: true },
          );
        });
        req.flash('info', i18next.t('flash.tasks.update.success'));
        reply.redirect(app.reverse('tasks'));
        return reply;
      } catch (error) {
        console.error(error);
        if (error instanceof ValidationError) {
          req.flash('error', i18next.t('flash.tasks.update.error'));
          const task = (new app.objection.models.task())
            .$set({ ...req.body.data, id });
          const statuses = await app.objection.models.status.query();
          const users = await app.objection.models.user.query();
          const labels = await app.objection.models.label.query();
          reply.render('tasks/edit', {
            task, statuses, users, labels, errors: error.data,
          });
          return reply.code(422);
        }
        throw error;
      }
    })
    .post('/tasks', async (req, reply) => {
      const task = new app.objection.models.task();
      task.$set(req.body.data);

      try {
        const creatorId = req.user.id;
        const {
          name, description, executorId, statusId, labels = [],
        } = req.body.data;
        const mapped = [...labels].flatMap((item) => ({ id: parseInt(item, 10) }));
        const validtask = await app.objection.models.task
          .fromJson({
            name, description, creatorId, executorId: parseInt(executorId, 10)
            || null, statusId: parseInt(statusId, 10),
          });
        await app.objection.models.task.transaction(async (trx) => {
          await app.objection.models.task.query(trx).insertGraph([{ ...validtask, labels: mapped }], { relate: ['labels'] });
        });
        req.flash('info', i18next.t('flash.tasks.create.success'));
        reply.redirect(app.reverse('tasks'));
      } catch (error) {
        req.flash('error', i18next.t('flash.tasks.create.error'));
        console.error(error);
        const statuses = await app.objection.models.status.query();
        const users = await app.objection.models.user.query();
        const labels = await app.objection.models.label.query();
        reply.render('tasks/new', {
          task, statuses, users, labels, errors: error.data,
        });
      }

      return reply;
    })
    .delete('/tasks/:id', { name: 'taskDelete', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;

      try {
        const task = await app.objection.models.task.query().findById(id);
        await task.$query().delete();
        req.flash('info', i18next.t('flash.tasks.delete.success'));
        reply.redirect(app.reverse('tasks'));
      } catch (error) {
        req.flash('error', i18next.t('flash.tasks.delete.error'));
        console.error(error);
        reply.redirect(app.reverse('tasks'));
      }

      return reply;
    });
};
