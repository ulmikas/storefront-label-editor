<template>
  <div id="app" v-bind:class="['normalized', 'settings-page', loading? 'loading' : '']">
      <transition name="fade" tag="div" mode="out-in">
        <component 
          :is="curScreen"
          :texts="texts"
          :count="count"
          :totalCount="totalCount"
          :stored="stored"
          :lang="lang"
          :labels="shownLabels"
          :changed="changed"
          :defaultLabels="initial"
          :langs="langs"
          :usedLangs="usedLangs"
          :multilang="multilang"
          v-model.trim="query"
          @set-lang="setLang"
          @add-label="addLabel"
          @delete-label="deleteLabel"
          @revert-label="revertLabel"
          @clear-search="clearSearch"
          @show-search="showSearch"
          @query-change="queryChange" />
      </transition>
    <div class="loader"></div>
    <div class="multilang_switcher">
      <span>Multilanguage: </span>
      <label class="checkbox tiny">
          <input type="checkbox" :checked="multilang" name="miltilang" @change="setMultilang">
          <div data-on="enabled" data-off="disabled">
              <div></div>
          </div>
      </label>
    </div>
  </div>
</template>

<script>
import LogScreen from './components/LogScreen';
import SelectLang from './components/SelectLang';
import WelcomeScreen from './components/WelcomeScreen';
import SearchResultsScreen from './components/SearchResultsScreen';

export default {
  name: 'app',
  components: { LogScreen, SearchResultsScreen, WelcomeScreen, SelectLang },
  props: ['initial', 'stored', 'langs', 'lang', 'multilang', 'translates', 'loading'],
  data() {
    return {
      texts: this.translates,
      query: '',
      changed: {},
      recentlyChanged: {},
      curScreen: (Object.keys(this.stored).length)
        ? 'log-screen'
        : 'welcome-screen',
      curLang: this.lang,
      screenChanged: false,
      firstTime: true,
    };
  },
  created() {
    if (!this.multilang && Object.keys(this.stored).length === 1) {
      this.curLang = Object.keys(this.stored)[0];
    }
    this.changed = this.stored[this.curLang] || {};
  },
  watch: {
    stored() {
      this.$nextTick(() => {
        if (!this.multilang && Object.keys(this.stored).length === 1) {
          this.curLang = Object.keys(this.stored)[0];
        }
        this.changed = this.stored[this.curLang] || {};
      });
    },
    lang() {
      this.curLang = this.lang;
      this.changed = this.stored[this.curLang] || {};
    },
    curScreen() {
      this.cleanLabels();
    },
  },
  methods: {
    queryChange() {
      this.recentlyChanged = {};
    },
    queryEnough() {
      return this.query.length > 1;
    },
    setLang(e) {
      this.$emit('set-lang', e);
    },
    addLabel(e) {
      const lkey = e.target.id.match(/:(.*)$/)[1];
      this.changed = {
        ...{},
        ...this.changed,
        [lkey]: e.target.value,
      };
      if (this.queryEnough()) {
        this.recentlyChanged = { ...{}, ...this.recentlyChanged, [lkey]: e.target.value };
      }
      this.saveLabels();
    },
    deleteLabel(key) {
      if (this.queryEnough()) {
        this.recentlyChanged = {
          ...{},
          ...Object.keys(this.recentlyChanged).reduce((result, k) => {
            if (k !== key) {
              result[k] = this.recentlyChanged[key]; // eslint-disable-line no-param-reassign
            }
            return result;
          }, {}),
        };
      }
      this.changed = {
        ...{},
        ...Object.keys(this.changed).reduce((result, k) => {
          if (k !== key) {
            result[k] = this.changed[k]; // eslint-disable-line no-param-reassign
          }
          return result;
        }, {}),
      };
      this.saveLabels();
    },
    revertLabel(key) {
      this.changed = {
        ...{},
        ...this.changed,
        [key]: this.initial[key],
      };
      if (this.queryEnough()) {
        this.recentlyChanged = { ...{}, ...this.recentlyChanged, [key]: this.initial[key] };
      }
      this.saveLabels();
    },
    cleanLabels() {
      if (this.changed && Object.keys(this.changed).length) {
        this.changed = {
          ...{},
          ...Object.keys(this.changed).reduce((result, k) => {
            if (this.changed[k] !== this.initial[k]) {
              result[k] = this.changed[k]; // eslint-disable-line no-param-reassign
            }
            return result;
          }, {}),
        };
      }
    },
    saveLabels() {
      const withEmpty = {
        ...{},
        ...this.stored,
        [this.curLang]: Object.keys(this.changed).reduce((result, key) => {
          if (this.changed[key] !== this.initial[key]) {
            result[key] = this.changed[key]; // eslint-disable-line no-param-reassign
          }
          return result;
        }, {}),
      };
      const savingLabels = {
        ...{},
        ...Object.keys(withEmpty).reduce((result, k) => {
          if (Object.keys(withEmpty[k]).length) {
            result[k] = withEmpty[k]; // eslint-disable-line no-param-reassign
          }
          return result;
        }, {}),
      };
      const data = {
        labels: Object.keys(savingLabels).length ? encodeURIComponent(JSON.stringify(savingLabels)) : '',
      };
      /* global EcwidApp:true */
      /* eslint no-undef: "error" */
      EcwidApp.setAppStorage(data, () => { });
      EcwidApp.setAppPublicConfig(data.labels, () => { });
    },
    setMultilang(e) {
      const data = {
        multilang: JSON.stringify(e.target.checked),
      };
      EcwidApp.setAppStorage(data, () => { });
    },
    clearSearch() {
      this.recentlyChanged = {};
      this.query = '';
      this.curScreen = (this.totalCount || (this.multilang && Object.keys(this.stored).length))
        ? 'log-screen'
        : 'welcome-screen';
    },
    isEmptyChanged() {
      return Object.keys(this.stored).length === 0;
    },
    showSearch() {
      this.curScreen = 'search-results-screen';
    },
  },
  computed: {
    labels() {
      return { ...{}, ...this.initial, ...this.changed };
    },
    count() {
      return Object.keys(this.recentlyChanged).length;
    },
    totalCount() {
      return (this.changed && Object.keys(this.changed).length)
        ? Object.keys(this.changed).length
        : 0;
    },
    shownLabels() {
      const obj = this.labels;
      const isSubstring = string => string.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
      const isContains = key => (isSubstring(key) || isSubstring(obj[key]));
      const isRecent = key => Object.prototype.hasOwnProperty.call(this.recentlyChanged, key);

      return (this.queryEnough())
        ? Object.keys(obj).reduce((newObj, key) =>
          ((isContains(key) || isRecent(key)) ? { ...newObj, [key]: obj[key] } : newObj), {})
        : {};
    },
    usedLangs() {
      return Object.keys(this.stored);
    },
  },
};
</script>

<style scoped>
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease-out;
}

/* header */
.sle-app-header {
  align-items: flex-start;
  display: flex;
  margin: 0 auto 32px;
  max-width: 980px;
  text-align: center;
}

.sle-app-header__logo img {
  max-width: 100%;
}

.sle-app-header__titles {
  flex: 1;
}

/* main */
.sle-app-main {
  margin: 0 auto;
  max-width: 980px;
}

.sle-app__action {
  margin-left: auto;
  padding-left: 8px;
  white-space: nowrap;
}

/* loader  */
#app.loading::after {
  content: '';
  background: #fff;
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

#app.loading .loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -66%);
  border: 8px solid #f3f3f3;
  border-top: 8px solid #3498db;
  border-radius: 50%;
  width: 64px;
  height: 64px;
  animation: spin 1s linear infinite;
  z-index: 2;
}

.multilang_switcher {
  display: none;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
