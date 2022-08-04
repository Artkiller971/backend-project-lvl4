import dotenv from "dotenv";

import addRoutes from './routes/index.js';

dotenv.config();
// eslint-disable-next-line no-unused-vars
export default (app, options) => {
  addRoutes(app);

  return app;
}