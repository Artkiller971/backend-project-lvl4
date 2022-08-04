import addRoutes from './routes/index.js';

// eslint-disable-next-line no-unused-vars
export default (app, options) => {
  addRoutes(app);

  return app;
}