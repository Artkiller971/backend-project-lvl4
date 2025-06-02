import i18next from 'i18next';
import { ValidationError } from 'objection';

export default (app) => {
  app
    .get('/users', { name: 'users' }, async (req, reply) => {
      const users = await app.objection.models.user.query();
      reply.render('users/index', { users });
      return reply;
    })
    .get('/users/new', { name: 'newUser' }, (req, reply) => {
      const user = new app.objection.models.user();
      reply.render('users/new', { user });
    })
    .get('/users/:id/edit', { name: 'editUser', preValidation: [app.authenticate, app.userCanEditProfile] }, async (req, reply) => {
      const id = req.params.id;

      const user = await app.objection.models.user.query().findById(id);

      if (!user) {
        reply.send('User does not exist');
        return reply;
      }
      reply.render('users/edit', { user });
      return reply;
    })
    .patch('/users/:id', { name: 'userEdit', preValidation: [app.authenticate, app.userCanEditProfile] }, async (req, reply) => {
      const id = req.params.id;

      try {
        const user = await app.objection.models.user.query().findById(id);
        await user.$query().patch(req.body.data);
        req.flash('info', i18next.t('flash.users.update.success'));
        reply.redirect(app.reverse('root'));
        return reply;
      } catch (error) {
        if (error instanceof ValidationError) {
          req.flash('error', i18next.t('flash.users.update.error'));
          const user = (new app.objection.models.user())
            .$set({ ...req.body.data, id });
          reply.render('users/edit', { user, errors: error.data });
          return reply.code(422);
        }
        throw error;
      }
    })
    .post('/users', async (req, reply) => {
      const user = new app.objection.models.user();
      user.$set(req.body.data);

      try {
        const validUser = await app.objection.models.user.fromJson(req.body.data);
        await app.objection.models.user.query().insert(validUser);
        req.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect(app.reverse('root'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/new', { user, errors: data });
      }

      return reply;
    })
    .delete('/users/:id', { name: 'userDelete', preValidation: [app.authenticate, app.userCanEditProfile] }, async (req, reply) => {
      const id = req.params.id;

      try {
        const user = await app.objection.models.user
          .query()
          .findById(id)
          .withGraphFetched('[createdTasks, assignedTasks]');

        if ((user.createdTasks.length !== 0) || (user.assignedTasks.length !== 0)) {
          req.flash('error', i18next.t('flash.users.delete.error'));
          reply.redirect(app.reverse('users'));
          return reply;
        }
        await user.$query().delete();
        req.logOut();
        req.flash('info', i18next.t('flash.users.delete.success'));
        reply.redirect(app.reverse('users'));
      } catch (error) {
        req.flash('error', i18next.t('flash.users.delete.error'));
        console.error(error);
        reply.redirect(app.reverse('users'));
      };

      return reply;
    });
};
