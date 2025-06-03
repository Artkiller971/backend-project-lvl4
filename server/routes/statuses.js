import i18next from 'i18next';
import { ValidationError } from 'objection';

export default (app) => {
  app
    .get('/statuses', { name: 'statuses', preValidation: app.authenticate }, async (req, reply) => {
      const statuses = await app.objection.models.status.query();
      reply.render('statuses/index', { statuses });
      return reply;
    })
    .get('/statuses/new', { name: 'newStatus' }, (req, reply) => {
      const status = new app.objection.models.status();
      reply.render('statuses/new', { status });
    })
    .get('/statuses/:id/edit', { name: 'editStatus', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;

      const status = await app.objection.models.status.query().findById(id);

      if (!status) {
        reply.send('Status does not exist');
        return reply;
      }
      reply.render('statuses/edit', { status });
      return reply;
    })
    .patch('/statuses/:id', { name: 'statusEdit', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;

      try {
        const status = await app.objection.models.status.query().findById(id);
        await status.$query().patch(req.body.data);
        req.flash('info', i18next.t('flash.statuses.update.success'));
        reply.redirect(app.reverse('statuses'));
        return reply;
      } catch (error) {
        if (error instanceof ValidationError) {
          req.flash('error', i18next.t('flash.statuses.update.error'));
          const status = (new app.objection.models.status())
            .$set({ ...req.body.data, id });
          reply.render('statuses/edit', { status, errors: error.data });
          return reply.code(422);
        }
        throw error;
      }
    })
    .post('/statuses', async (req, reply) => {
      const status = new app.objection.models.status();
      status.$set(req.body.data);

      try {
        const validStatus = await app.objection.models.status.fromJson(req.body.data);
        await app.objection.models.status.query().insert(validStatus);
        req.flash('info', i18next.t('flash.statuses.create.success'));
        reply.redirect(app.reverse('statuses'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.statuses.create.error'));
        reply.render('statuses/new', { status, errors: data });
      }

      return reply;
    })
    .delete('/statuses/:id', { name: 'statusDelete', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;

      try {
        const status = await app.objection.models.status
          .query()
          .findById(id)
          .withGraphFetched('tasks');

        if (status.tasks.length !== 0) {
          req.flash('error', i18next.t('flash.statuses.delete.error'));
          reply.redirect(app.reverse('statuses'));
          return reply;
        }

        await status.$query().delete();
        req.flash('info', i18next.t('flash.statuses.delete.success'));
        reply.redirect(app.reverse('statuses'));
      } catch (error) {
        req.flash('error', i18next.t('flash.statuses.delete.error'));
        console.error(error);
        reply.redirect(app.reverse('statuses'));
      }

      return reply;
    });
};
