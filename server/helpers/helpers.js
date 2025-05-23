import i18next from 'i18next';
import _ from 'lodash';

export default (app) => ({
  route(name, params = {}) {
    return app.reverse(name, params);
  },
  _,
  t(key) {
    return i18next.t(key);
  },
  getAlertClass(type) {
    switch (type) {
      // case 'failure':
      //   return 'danger';
      case 'error':
        return 'danger';
      case 'success':
        return 'success';
      case 'info':
        return 'info';
      default:
        throw new Error(`Unknown flash type: '${type}'`);
    }
  },
  formatDate(str) {
    const date = new Date(str);
    return date.toLocaleString();
  },
});
