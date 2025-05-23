import i18next from 'i18next';
import { ValidationError } from 'objection';

export default (app) => {
  app
    .get('/tasks', { name: 'tasks', preValidation: app.authenticate }, async (req, reply) => {
      const tasks = await app.objection.models.task.query();
      reply.render('tasks/index', { tasks });
      return reply;
    })
    .get('/tasks/new', { name: 'newTask' }, (req, reply) => {
      const task = new app.objection.models.task();
      reply.render('tasks/new', { task });
    })
    .get('/tasks/:id/edit', { name: 'editTask', preValidation: app.authenticate }, async (req, reply) => {
      const id = req.params.id;

      const task = await app.objection.models.task.query().findById(id);

      if (!task) {
        reply.send('Task does not exist');
        return reply;
      }
      reply.render('tasks/edit', { task });
      return reply;
    })
    .patch('/tasks/:id', { name: 'taskEdit', preValidation: app.authenticate }, async (req, reply) => {
      const id = req.params.id;

      try {
        const task = await app.objection.models.task.query().findById(id);
        await task.$query().patch(req.body.data);
        req.flash('info', i18next.t('flash.tasks.update.success'));
        reply.redirect(app.reverse('root'));
        return reply;
      } catch (error) {
        if (error instanceof ValidationError) {
          req.flash('error', i18next.t('flash.tasks.update.error'));
          const task = (new app.objection.models.task())
            .$set({ ...req.body.data, id });
          reply.render('tasks/edit', { task, errors: error.data });
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
        const validtask = await app.objection.models.task.fromJson({ ...req.body.data, creatorId });
        await app.objection.models.task.query().insert(validtask);
        req.flash('info', i18next.t('flash.tasks.create.success'));
        reply.redirect(app.reverse('root'));
      } catch (error) {
        req.flash('error', i18next.t('flash.tasks.create.error'));
        console.error(error);
        reply.render('tasks/new', { task, errors: error.data });
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
