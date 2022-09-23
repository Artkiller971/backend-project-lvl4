export default (app) => {
  app
    .get('/users/new', (req, reply) => {
      reply.view('users/new');
  })
};