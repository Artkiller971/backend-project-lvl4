import i18next from "i18next";

export default (app) => {
  app
    .get('/labels', { preValidation: app.authenticate }, async (req, reply) => {
      const labels = await app.objection.models.label.query();
      reply.render('labels/index', { labels });
      return reply;
    })
}