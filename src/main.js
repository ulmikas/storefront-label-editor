import axios from 'axios';
import Vue from 'vue';
import App from './App';
import { getDefaultLabels, getStoredLabels, getMultilangFlag } from './getLabels';
import getLangsNames from './getLangs';
import translates from './texts';

/* eslint-disable no-undef */
EcwidApp.init({
  // app_id: 'custom-translations-app',
  app_id: 'storefront-label-editor',
  autoloadedflag: true,
  autoheight: true,
});

const storeData = EcwidApp && EcwidApp.getPayload();
if (!storeData) {
  console.warn('Can\'t get EcwidApp.getPayload()');
} else {
  const curAdminLang = (storeData && storeData.lang) || 'en';
  const adminLang = (Object.keys(translates).indexOf(curAdminLang) === -1) ? 'en' : curAdminLang;
  const sId = storeData.store_id;
  const sToken = storeData.access_token;

  const getStored = async () => {
    const stored = await getStoredLabels();
    const ml = await getMultilangFlag();
    /* global EcwidApp:true */
    /* eslint no-undef: "error" */
    EcwidApp.setAppStorage({
      multilang: JSON.stringify(ml || Object.keys(stored).length > 1),
    }, () => {});
    return stored;
  };

  const getStoreLanguages = async (storeId, token) => {
    const url = `https://app.ecwid.com/api/v3/${storeId}/profile?token=${token}`;
    const langs = await axios.get(url)
      .then(response => response && response.data &&
        response.data.languages && response.data.languages.enabledLanguages);
    return langs;
  };
  const getAppStorage = async (storeId, token) => {
    const [languages, storedLabels, multilang] = await Promise.all([
      getStoreLanguages(storeId, token),
      getStored(),
      getMultilangFlag(),
    ]);
    return { languages, storedLabels, multilang };
  };

  const createApp = (props) => {
    const langsNames = getLangsNames();
    /* eslint-disable no-new */
    /* eslint-disable no-unused-vars */
    const sle = new Vue({
      el: '#app',
      template: '<App :loading="loading" :initial="initial" :stored="storedL" :lang="lang" :langs="langs" :multilang="multilang" :translates="translates" @set-lang="setLang" />',
      components: { App },
      data: {
        loading: false,
        initial: {},
        storedL: props.storedLabels,
        lang: props.languages[0],
        langs: props.languages.map(l => ({ code: l, name: langsNames[l] })),
        multilang: props.multilang,
        translates: translates[adminLang],
        // editable: usedLangs,
      },
      created() {
        this.getInitialLabels();
      },
      mounted() {
        EcwidApp.setSize({ height: this.$el.offsetHeight });
      },
      watch: {
        lang() {
          this.getInitialLabels();
          this.getStoredLabels();
        },
      },
      methods: {
        setLang(e) {
          this.lang = e.target.rel;
          this.loading = true;
        },
        getInitialLabels() {
          const vm = this;
          const getLabels = async (l) => {
            const labels = await getDefaultLabels(l);
            vm.loading = false;
            vm.initial = labels;
          };
          getLabels(this.lang);
        },
        getStoredLabels() {
          const vm = this;
          getStored().then((v) => {
            vm.storedL = v;
          });
        },
        startEdit() {
          this.editable = true;
        },
      },
    });
  };

  const initApp = (props) => {
    createApp(props);
  };

  getAppStorage(sId, sToken).then((v) => {
    initApp(v);
  });
}
