export default (app) => {
  app
    .get('/', (req, reply) => {
      reply.send('Hello, this is a welcome page');
    })
};
