(() => {
  let newEcwidMessages;

  const publicConfig = Ecwid.getAppPublicConfig('storefront-label-editor');
  if (!publicConfig) {
    return;
  }
  const translates = JSON.parse(decodeURIComponent(publicConfig));
  const langs = Object.keys(translates);

  if (langs.length === 0) {
    return;
  }

  if (langs.length === 1) {
    newEcwidMessages = translates[langs[0]];
    if (window.ecwidMessages) {
      window.ecwidMessages = Object.assign(window.ecwidMessages, newEcwidMessages);
    } else {
      window.ecwidMessages = Object.assign({}, newEcwidMessages);
    }
  } else {
    Ecwid.OnAPILoaded.add(() => {
      const curLang = Ecwid.getStorefrontLang() || 'en';
      newEcwidMessages = translates[curLang];
      if (window.ecwidMessages) {
        window.ecwidMessages = Object.assign(window.ecwidMessages, newEcwidMessages);
      } else {
        window.ecwidMessages = Object.assign({}, newEcwidMessages);
      }
    });
  }
})();
