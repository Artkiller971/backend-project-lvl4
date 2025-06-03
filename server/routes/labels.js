import i18next from 'i18next';
import { ValidationError } from 'objection';

export default (app) => {
  app
    .get('/labels', { name: 'labels', preValidation: app.authenticate }, async (req, reply) => {
      const labels = await app.objection.models.label.query();
      reply.render('labels/index', { labels });
      return reply;
    })
    .get('/labels/new', { name: 'newLabel' }, (req, reply) => {
      const label = new app.objection.models.label();
      reply.render('labels/new', { label });
    })
    .get('/labels/:id/edit', { name: 'editLabel', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;

      const label = await app.objection.models.label.query().findById(id);

      if (!label) {
        reply.send('Label does not exist');
        return reply;
      }
      reply.render('labels/edit', { label });
      return reply;
    })
    .patch('/labels/:id', { name: 'labelEdit', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;

      try {
        const label = await app.objection.models.label.query().findById(id);
        await label.$query().patch(req.body.data);
        req.flash('info', i18next.t('flash.labels.update.success'));
        reply.redirect(app.reverse('labels'));
        return reply;
      } catch (error) {
        if (error instanceof ValidationError) {
          req.flash('error', i18next.t('flash.labels.update.error'));
          const label = (new app.objection.models.label())
            .$set({ ...req.body.data, id });
          reply.render('labels/edit', { label, errors: error.data });
          return reply.code(422);
        }
        throw error;
      }
    })
    .post('/labels', async (req, reply) => {
      const label = new app.objection.models.label();
      label.$set(req.body.data);

      try {
        const validLabel = await app.objection.models.label.fromJson(req.body.data);
        await app.objection.models.label.query().insert(validLabel);
        req.flash('info', i18next.t('flash.labels.create.success'));
        reply.redirect(app.reverse('labels'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.labels.create.error'));
        reply.render('labels/new', { label, errors: data });
      }

      return reply;
    })
    .delete('/labels/:id', { name: 'labelDelete', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;

      try {
        const label = await app.objection.models.label
          .query()
          .findById(id)
          .withGraphFetched('tasks');

        if (label.tasks.length !== 0) {
          req.flash('error', i18next.t('flash.labels.delete.error'));
          reply.redirect(app.reverse('labels'));
          return reply;
        }

        await label.$query().delete();
        req.flash('info', i18next.t('flash.labels.delete.success'));
        reply.redirect(app.reverse('labels'));
      } catch (error) {
        req.flash('error', i18next.t('flash.labels.delete.error'));
        console.error(error);
        reply.redirect(app.reverse('labels'));
      }

      return reply;
    });
};
