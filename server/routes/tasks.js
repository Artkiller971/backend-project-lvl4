import i18next from 'i18next';

export default (app) => {
  app
    .get('/tasks', { preValidation: app.authenticate }, async (req, reply) => {
      const filter = req.query;
      filter.status = filter.status ? Number(filter.status) : null
      filter.executor = filter.executor ? Number(filter.executor) : null
      filter.label = filter.label ? Number(filter.label) : null
      filter.creator = filter.isCreatorUser ? Number(req.user.id) : null
      const tasks = await app.objection.models.task.query()
        .withGraphJoined('[creator, executor, status, labels]')
        .modify('filterStatus', filter.status)
        .modify('filterExecutor', filter.executor)
        .modify('filterLabel', filter.label)
        .modify('filterCreator', filter.creator)
      const users = await app.objection.models.user.query();
      const statuses = await app.objection.models.taskStatus.query();
      const labels = await app.objection.models.label.query();
      reply.render('tasks/index', { tasks, users, statuses, labels, filter });
      return reply;
    })
    .get('/tasks/:id', { preValidation: app.authenticate }, async (req, reply) => {
      const id = parseInt(req.params.id);

      const task = await app.objection.models.task
        .query()
        .findById(id)
        .withGraphJoined('[creator, executor, status, labels]');
        
      reply.render('tasks/task', { task });
      return reply;
    })
    .get('/tasks/new', { preValidation: app.authenticate }, async (req, reply) => {
      const task = new app.objection.models.task();
      const users = await app.objection.models.user.query();
      const statuses = await app.objection.models.taskStatus.query();
      const labels = await app.objection.models.label.query();
      reply.render('tasks/new', { task, users, statuses, labels });
      return reply;
    })
    .get('/tasks/:id/edit', { preValidation: app.authenticate }, async (req, reply) => {
      const id = parseInt(req.params.id);

      const taskToEdit = await app.objection.models.task
        .query()
        .findById(id)
        .withGraphFetched('[executor, status, labels]');
      const users = await app.objection.models.user.query();
      const statuses = await app.objection.models.taskStatus.query();
      const labels = await app.objection.models.label.query();
      reply.render('tasks/edit', { task: taskToEdit, users, statuses, labels });
      return reply;
    })
    .post('/tasks', { preValidation: app.authenticate }, async (req, reply) => {

      const data = { ...req.body.data };

      try {
       if (data.labels) {
        data.labels = [...data.labels].map((labelId) => Number(labelId));
       } else  {
        data.labels = [];
       }
       data.statusId = data.statusId ? Number(data.statusId): null;
       data.executorId = data.executorId ? Number(data.executorId): null;
       data.creatorId = req.user.id;

       const parsedData = await app.objection.models.task.fromJson(data);
       const graph = {
         ...parsedData,

         creator: {
           id: data.creatorId,
         },

         status: {
           id: data.statusId,
         },
         
       };

       if (data.executorId) {
         graph.executor = { id: data.executorId };
       }

       if (data.labels) {
        graph.labels = graph.labels.map((id) => ({ id }));
       }

       await app.objection.models.task.knex().transaction(async (trx) => {
         await app.objection.models.task.query(trx).insertGraph(graph, { relate: true });
       })
       req.flash('info', i18next.t('flash.tasks.create.success'));
       reply.redirect('/tasks');
       return reply;
      } catch (err) {
       req.flash('error', i18next.t('flash.tasks.create.error'));
       const users = await app.objection.models.user.query();
       const statuses = await app.objection.models.taskStatus.query();
       reply.render('tasks/new', {
         task: data,
         users,
         statuses,
         errors: err.data
       })

        return reply;
      }

})
    .patch('/tasks/:id', { preValidation: app.authenticate }, async (req, reply) => {
      const data = { ...req.body.data };
      try {
        data.statusId = data.statusId ? Number(data.statusId): null;
        data.executorId = data.executorId ? Number(data.executorId): null;

        if (data.labels) {
          data.labels = [...data.labels].map((labelId) => Number(labelId));
         } else  {
          data.labels = [];
         }
        const parsedData = await app.objection.models.task.fromJson(data);


        const graph = {
          id: Number(req.params.id),
          ...parsedData,
          

          status: {
            id: data.statusId,
          }
        };

        if (data.executorId) {
          graph.executor = { id: data.executorId };
        }
        if (data.labels) {
          graph.labels = graph.labels.map((id) => ({ id }));
         }

        await app.objection.models.task.knex().transaction(async (trx) => {
          await app.objection.models.task.query(trx).upsertGraph(
            graph,
            { relate: true, unrelate: true, noUnrelate: ['creatorId']}
          )
        });
        req.flash('info', i18next.t('flash.tasks.edit.success'));
        reply.redirect('/tasks');
        return reply;
      } catch (err) {
        req.flash('error', i18next.t('flash.tasks.edit.error'));
        const users = await app.objection.models.user.query();
        const statuses = await app.objection.models.taskStatus.query();
        reply.render('tasks/new', {
          task: data,
          users,
          statuses,
          errors: err.data
        })
      }

      return reply;
    })
    .delete('/tasks/:id', { preValidation: app.authenticate }, async (req, reply) => {
      const id = parseInt(req.params.id);

      const taskToDelete = await app.objection.models.task
        .query()
        .findById(id)
      if (taskToDelete.creatorId !== req.user.id) {
        req.flash('error', i18next.t('flash.tasks.delete.error'));
        reply.redirect('/tasks');
        return reply;
      }

      try {
        await taskToDelete.$query().delete();
        req.flash('info', i18next.t('flash.tasks.delete.success'));
      } catch {
        req.flash('error', i18next.t('flash.tasks.delete.error'));
      }

      reply.redirect('/tasks');
      return reply;
    })
}