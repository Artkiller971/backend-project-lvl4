import i18next from 'i18next';

export default (app) => {
  app
    .get('/users', async (req, reply) => {
      const users = await app.objection.models.user.query();
      reply.render('users/index', { users });
      return reply;
    })
    .get('/users/new', (req, reply) => {
      const user = new app.objection.models.user();
      reply.render('users/new', { user });
    })
    .get('/users/:id/edit', { preValidation: app.authenticate }, async (req, reply) => {
      const id = parseInt(req.params.id);

      if(req.user.id !== id) {
        req.flash('error', i18next.t('flash.users.edit.error'));
        return reply.redirect('/');
      }
      const userToEdit = await app.objection.models.user.query().findById(id);
      reply.render('users/edit', { user: userToEdit });
      return reply;
    })
    .patch('/users/:id', { preValidation: app.authenticate }, async (req, reply) => {
      const id = parseInt(req.params.id)
      const user = new app.objection.models.user();
      user.$set(req.body.data);

      try {
        const validUser = await app.objection.models.user.fromJson(req.body.data);
        const userToUpdate = await app.objection.models.user.query().findById(id);
        await userToUpdate.$query().update(validUser);
        req.flash('info', i18next.t('flash.users.edit.success'));
        reply.redirect('/users');
      } catch ({ data }) { // err.data
        req.flash('error', i18next.t('flash.users.edit.error'));
        reply.render('users/edit', { user, errors: data })
      };

      return reply;
    })
    .post('/users', async (req, reply) => {
      const user = new app.objection.models.user();
      user.$set(req.body.data);

      try {
        const validUser = await app.objection.models.user.fromJson(req.body.data);
        await app.objection.models.user.query().insert(validUser);
        req.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect('/users');
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/new', { user, errors: data })
      }

      return reply;
    })
    .delete('/users/:id', { preValidation: app.authenticate }, async (req, reply) => {

      const id = parseInt(req.params.id);

      if(req.user.id !== id) {
        req.flash('error', i18next.t('flash.users.delete.error'));
        return reply.redirect('/users');
      }

      try {
        const userToDelete = await app.objection.models.user.query().findById(id);
        const createdTasks = await userToDelete.$relatedQuery('createdTasks');
        const assignedTasks = await userToDelete.$relatedQuery('assignedTasks');
        if (createdTasks.length > 0 || assignedTasks.length > 0) {
          req.flash('error', i18next.t('flash.users.delete.existsError'));
          reply.redirect('/users');
        } else {
        await userToDelete.$query().delete();
        req.logOut();
        req.flash('info', i18next.t('flash.users.delete.success'));
        reply.redirect('/users');
        }
      } catch (error) {
        const users = await app.objection.models.user.query();
        req.flash('error', i18next.t('flash.users.delete.error'));
        reply.render('users/index', {users, errors: error.data});
      }

      return reply;
    });
};