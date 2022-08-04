import Fastify from "fastify";
import dotenv from "dotenv";

import addRoutes from './routes/index.js';

dotenv.config();

export default () => {
  const app = Fastify({ logger: true });

  addRoutes(app);

  return app;
}