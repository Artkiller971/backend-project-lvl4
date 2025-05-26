import i18next from 'i18next';
import { ValidationError } from 'objection';

export default (app) => {
  app
    .get('/tasks', { name: 'tasks', preValidation: app.authenticate }, async (req, reply) => {
      const tasks = await app.objection.models.task.query().withGraphFetched('[status, creator, executor]');
      reply.render('tasks/index', { tasks });
      return reply;
    })
    .get('/tasks/new', { name: 'newTask' }, async (req, reply) => {
      const task = new app.objection.models.task();
      const statuses = await app.objection.models.status.query();
      const users = await app.objection.models.user.query();
      reply.render('tasks/new', { task, statuses, users });
      return reply;
    })
    .get('/tasks/:id/edit', { name: 'editTask', preValidation: app.authenticate }, async (req, reply) => {
      const id = req.params.id;

      const task = await app.objection.models.task.query().findById(id);
      const statuses = await app.objection.models.status.query();
      const users = await app.objection.models.user.query();

      if (!task) {
        reply.send('Task does not exist');
        return reply;
      }
      reply.render('tasks/edit', { task, statuses, users });
      return reply;
    })
    .get('/tasks/:id', { name: 'showTask' }, async (req, reply) => {
      const task = await app.objection.models.task.query().findById(req.params.id).withGraphFetched('[status, creator, executor]');
      reply.render('tasks/show', { task });
      return reply;
    })
    .patch('/tasks/:id', { name: 'taskEdit', preValidation: app.authenticate }, async (req, reply) => {
      const id = req.params.id;

      try {
        const task = await app.objection.models.task.query().findById(id);
        const { name, description, executorId, statusId } = req.body.data;
        await task.$query().patch({ name, description, executorId: parseInt(executorId, 10), statusId: parseInt(statusId, 10) });
        req.flash('info', i18next.t('flash.tasks.update.success'));
        reply.redirect(app.reverse('root'));
        return reply;
      } catch (error) {
        if (error instanceof ValidationError) {
          req.flash('error', i18next.t('flash.tasks.update.error'));
          const task = (new app.objection.models.task())
            .$set({ ...req.body.data, id });
          const statuses = await app.objection.models.status.query();
          const users = await app.objection.models.user.query();
          reply.render('tasks/edit', { task, statuses, users, errors: error.data });
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
        const { name, description, executorId, statusId } = req.body.data;
        const validtask = await app.objection.models.task
          .fromJson({ name, description, creatorId, executorId: parseInt(executorId, 10), statusId: parseInt(statusId, 10) });
        await app.objection.models.task.query().insert(validtask);
        req.flash('info', i18next.t('flash.tasks.create.success'));
        reply.redirect(app.reverse('root'));
      } catch (error) {
        req.flash('error', i18next.t('flash.tasks.create.error'));
        console.error(error);
        const statuses = await app.objection.models.status.query();
        const users = await app.objection.models.user.query();
        reply.render('tasks/new', { task, statuses, users, errors: error.data });
      }

      return reply;
    })
    .delete('/tasks/:id', { name: 'taskDelete', preValidation: app.authenticate }, async (req, reply) => {
      const id = req.params.id;

      try {
        const task = await app.objection.models.task.query().findById(id);
        await task.$query().delete();
        req.flash('info', i18next.t('flash.tasks.delete.success'));
        reply.redirect(app.reverse('tasks'));
      } catch (error) {
        req.flash('error', i18next.t('flash.tasks.delete.error'));
        console.error(error);
        reply.redirect(app.reverse('tasks'));
      };

      return reply;
    });
};
