export default (app) => {
  app
    .get('/session/new', (req, reply) => {
      reply.view('session/new');
  })
}