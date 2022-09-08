import i18next from "i18next";

export default (app) => ({
  t(key) {
    return i18next.t(key);
  },
});
