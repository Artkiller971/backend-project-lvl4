import i18next from 'i18next';

export default (app) => {
  app
    .get('/statuses', { preValidation: app.authenticate } ,async (req, reply) => {
      const statuses = await app.objection.models.taskStatus.query();
      reply.render('statuses/index', { statuses });
      return reply;
    })
    .get('/statuses/new', { preValidation: app.authenticate }, async (req, reply) => {
      const status = new app.objection.models.taskStatus();
      reply.render('statuses/new', { status });
      return reply;
    })
    .get('/statuses/:id/edit', { preValidation: app.authenticate }, async (req, reply) => {
      const id = parseInt(req.params.id);
      const statusToEdit = await app.objection.models.taskStatus.query().findById(id);
      reply.render('statuses/edit', { status: statusToEdit});
      return reply;
    })
    .post('/statuses', { preValidation: app.authenticate }, async(req, reply) => {
      const status = new app.objection.models.taskStatus();
      status.$set(req.body.data);

      try {
        const validStatus = await app.objection.models.taskStatus.fromJson(req.body.data);
        await app.objection.models.taskStatus.query().insert(validStatus);
        req.flash('info', i18next.t('flash.statuses.create.success'));
        reply.redirect('/statuses');
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.statuses.create.error'));
        reply.render('statuses/new', { status, errors: data});
      }

      return reply;
    })
    .patch('/statuses/:id', { preValidation: app.authenticate }, async(req, reply) => {
      const id = parseInt(req.params.id);

      const status = new app.objection.models.taskStatus();
      status.$set(req.body.data);

      try {
        const validStatus = await app.objection.models.taskStatus.fromJson(req.body.data);
        const statusToUpdate = await app.objection.models.taskStatus.query().findById(id);
        await statusToUpdate.$query().update(validStatus);
        req.flash('info', i18next.t('flash.statuses.edit.success'));
        reply.redirect('/statuses');
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.statuses.edit.error'));
        reply.render('statuses/edit', {status, errors: data});
      }

      return reply;
    })
    .delete('/statuses/:id', { preValidation: app.authenticate }, async(req, reply) => {
      const id = parseInt(req.params.id);

      try {
        const statusToDelete = await app.objection.models.taskStatus.query().findById(id);
        const tasksWithCurrentStatus = await app.objection.models.task
          .query()
          .where('statusId', id);
        if (tasksWithCurrentStatus.length > 0) {
          req.flash('error', i18next.t('flash.statuses.delete.existError'));
          reply.redirect('/statuses');
        } else {
          await statusToDelete.$query().delete();
          req.flash('info', i18next.t('flash.statuses.delete.success'));
          reply.redirect('/statuses');
        }
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.statuses.delete.error'));
        reply.render('statuses/index', { errors: data })
      }

      return reply;
    })
}