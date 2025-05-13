export default (app) => {
  app
    .get('/', { name: 'root' }, (req, reply) => {
      reply.render('welcome/index');
      return reply;
    })
    .get('/protected', { name: 'protected', preValidation: app.authenticate }, (req, reply) => {
      reply.render('welcome/index');
    });
};
