export default (app) => {
  app
    .get('/', (req, reply) => {
      reply.render('welcome/index');
    });
  // .get('/protected', { name: 'protected', preValidation: app.authenticate }, (req, reply) => {
  //   reply.render('welcome/index');
  // });
};
