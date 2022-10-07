import i18next from "i18next";
import _ from 'lodash';

export default (app) => ({
  t(key) {
    return i18next.t(key);
  },
  formatDate(str) {
    const date = new Date(str);
    return date.toLocaleString();
  },
  _,
  getAlertClass(type) {
    switch (type) {
      case 'failure':
        return 'danger';
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
});
