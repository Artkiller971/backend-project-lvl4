import Fastify from "fastify";

import addRoutes from './routes/index.js';

export default () => {
  const app = Fastify({ logger: true });

  addRoutes(app);

  return app;
}