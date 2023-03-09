import i18next from "i18next";

export default (app) => {
  app
    .get('/labels', { preValidation: app.authenticate }, async (req, reply) => {
      const labels = await app.objection.models.label.query();
      reply.render('labels/index', { labels });
      return reply;
    })
    .get('/labels/new', { preValidation: app.authenticate }, async (req, reply) => {
      const label = new app.objection.models.label();
      reply.render('labels/new', { label });
      return reply;
    })
    .get('/labels/:id/edit', { preValidation: app.authenticate }, async (req, reply) => {
      const id = parseInt(req.params.id);
      const labelToEdit = await app.objection.models.label.query().findById(id);
      reply.render('labels/edit', { label: labelToEdit });
      return reply;
    })
    .post('/labels', { preValidation: app.authenticate }, async (req, reply) => {
      const label = new app.objection.models.label();
      label.$set(req.body.data);

      try {
        const validLabel = await app.objection.models.label.fromJson(req.body.data);
        await app.objection.models.label.query().insert(validLabel);
        req.flash('info', i18next.t('flash.labels.create.success'));
        reply.redirect('/labels');
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.labels.create.error'));
        reply.render('statuses/new', { label, errors: data});
      }

      return reply;
    })
    .delete('/labels/:id', { preValidation: app.authenticate }, async (req, reply) => {
      const id = parseInt(req.params.id);

      const labelToDelete = await app.objection.models.label.query().findById(id);
      const tasksWithCurrentLabel = await labelToDelete.$relatedQuery('tasks');

      if (tasksWithCurrentLabel.length > 0) {
        req.flash('error', i18next.t('flash.labels.delete.existError'));
        reply.redirect('/labels');
        return reply;
      }

      try {
        await labelToDelete.$query().delete();
        req.flash('info', i18next.t('flash.labels.delete.success'));
      } catch {
        req.flash('error', i18next.t('flash.labels.delete.error'));
      }

      reply.redirect('/labels');
      return reply;
    })
    .patch('/labels/:id', { preValidation: app.authenticate }, async (req, reply) => {
      const id = parseInt(req.params.id);

      const label = new app.objection.models.label();
      label.$set(req.body.data);

      try {
        const validLabel = await app.objection.models.label.fromJson(req.body.data);
        const labelToUpdate = await app.objection.models.label.query().findById(id);
        await labelToUpdate.$query().update(validLabel);
        req.flash('info', i18next.t('flash.labels.edit.success'));
        reply.redirect('/labels');
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.labels.edit.error'));
        reply.render('labels/edit', { label, errors: data});
      }

      return reply;
    })
}