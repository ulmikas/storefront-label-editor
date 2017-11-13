/* global EcwidApp:true */
/* eslint no-undef: "error" */

const getEnglishLabels = () => new Promise((resolve) => {
  window.Ecwid = {};
  window.Ecwid.MessageBundles = {};
  window.Ecwid.MessageBundles['ru.cdev.xnext.client'] = {};

  const mb = document.createElement('script');
  mb.src = 'https://app.ecwid.com/messages/ru.cdev.xnext.client/lang/en';
  document.body.appendChild(mb);
  mb.onload = () => {
    resolve(window.Ecwid.MessageBundles['ru.cdev.xnext.client']);
  };
});

const getDefaultLabels = lang => new Promise((resolve) => {
  getEnglishLabels().then((res) => {
    if (lang === 'en') {
      resolve(res);
      return;
    }
    const englishLabels = { ...{}, ...res };
    window.Ecwid = {};
    window.Ecwid.MessageBundles = {};
    window.Ecwid.MessageBundles['ru.cdev.xnext.client'] = {};
    const mb = document.createElement('script');
    mb.src = `https://app.ecwid.com/messages/ru.cdev.xnext.client/lang/${lang}`;
    document.body.appendChild(mb);
    mb.onload = () => {
      resolve({ ...{}, ...englishLabels, ...window.Ecwid.MessageBundles['ru.cdev.xnext.client'] });
    };
  });
});

const getStoredLabels = () => new Promise((resolve) => {
  const filtered = obj => Object.keys(obj).reduce((akk, i) => {
    if (Object.keys(obj[i]).length > 0) {
      return { ...akk, [i]: { ...{}, ...obj[i] } };
    }
    return akk;
  }, {});

  EcwidApp.getAppStorage('labels', (data) => {
    const obj = (data && JSON.parse(decodeURIComponent(data))) || {};
    resolve(filtered(obj));
  });
});

const getMultilangFlag = () => new Promise((resolve) => {
  // resolve(false);
  EcwidApp.getAppStorage('multilang', (data) => {
    const ml = (data && JSON.parse(data)) || false;
    resolve(ml);
  });
});

export { getDefaultLabels, getStoredLabels, getMultilangFlag };
