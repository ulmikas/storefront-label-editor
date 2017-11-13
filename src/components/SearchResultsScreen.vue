<template>
  <div>
    <div class="app-breadcrumbs">
      <a href="" @click="clearSearch">
        <svg width="5" height="9" viewBox="0 0 17 31" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.62132035,15.5 L16.5606602,2.56066017 C17.1464466,1.97487373 17.1464466,1.02512627 16.5606602,0.439339828 C15.9748737,-0.146446609 15.0251263,-0.146446609 14.4393398,0.439339828 L0.439339824,14.4393398 C0.146446606,14.7322331 -1.63437291e-09,15.1161165 2.77555688e-17,15.5 C1.50524455e-09,15.8838835 0.146446611,16.267767 0.439339828,16.5606602 L14.4393398,30.5606601 C15.0251263,31.1464465 15.9748737,31.1464465 16.5606602,30.56066 C17.1464466,29.9748736 17.1464466,29.0251261 16.5606602,28.4393397 L3.62132035,15.5 Z"></path>
        </svg>&nbsp;{{ texts.backToLog }}
      </a>
    </div>
    <div class="app-container">
      <header class="sle-app-header">
        <div class="sle-app-header__titles">
          <h1 class="sle-app-header__title">{{ texts.searchTitle }}</h1>
          <div class="sle-app-header__subtitle">{{ texts.searchSubtitle }}</div>
        </div>
      </header>
  
      <div class="search-wrapper">
        <div class="input-group">
          <input ref="input" :placeholder="texts.placeholder" class="form-control input-large" type="text" :value="value" @input="updateValue($event.target.value)" />
          <SelectLang :size="'large'" class="search-lang-select" v-if="multilang" :langs="langs" :usedLangs="usedLangs" :lang="lang" @set-lang="setLang" />
        </div>
      </div>
  
      <div v-if="value.length > 1 || showalllabels">
        <div v-if="isEmpty()" class="nothing">
          <div class="nothing__image">
            <img src="../assets/nothing.png" alt="Nothing is found" />
          </div>
          <div class="nothing__title">{{ texts.notFound.title }}</div>
          <div class="nothing__text">{{ texts.notFound.text.replace('[searchquery]', value) }}</div>
          <div>
            <a href="" @click="clearSearch" class="nothing__link">{{ texts.notFound.link }}</a>
          </div>
          <div>
            <a href="" @click="showAll" class="nothing__link">{{ texts.notFound.linkAll }}</a>
          </div>
        </div>
        <div v-else>
          <div class="search-result">
            <div class="search-result__title">
              {{ texts.searchResults.title }}
            </div>
            <div class="search-result__count">
              <transition name="fade">
                <span>
                  <b>{{ addedCount }}</b>
                </span>
              </transition>
              <a href="" @click="clearSearch">{{ texts.searchResults.backLink }}</a>
            </div>
          </div>
  
          <LabelsList key="searchedLabels" :editable="true" :lang="lang" :labels="labels" :texts="texts" :defaultLabels="defaultLabels" :count="count" :totalCount="totalCount" @add-label="addLabel" @revert-label="revertLabel" @clear-search="clearSearch" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LabelsList from './LabelsList';
import SelectLang from './SelectLang';

export default {
  name: 'search-results-screen',
  props: ['texts', 'count', 'totalCount', 'usedLangs', 'shown', 'langs', 'lang', 'multilang', 'labels', 'defaultLabels', 'value', 'showalllabels'],
  components: { LabelsList, SelectLang },
  data() {
    return {};
  },
  methods: {
    clearSearch(e) {
      e.preventDefault();
      this.$emit('clear-search');
    },
    addLabel(e) {
      this.$emit('add-label', e);
    },
    deleteLabel(key) {
      this.$emit('delete-label', key);
    },
    revertLabel(key) {
      this.$emit('revert-label', key);
    },
    updateValue(value) {
      this.$emit('query-change', value);
      this.$emit('input', value);
    },
    showAll(e) {
      e.preventDefault();
      this.$emit('show-all');
    },
    setLang(e) {
      this.$emit('set-lang', e);
    },
    isEmpty() {
      return Object.keys(this.labels).length === 0;
    },
  },
  computed: {
    backlink() {
      let backLink = this.texts.emptyChanged;
      if (this.totalCount > 0) {
        backLink = (this.count > 0) ? this.texts.backToLog.replace(/\{count\}/, this.count) : this.texts.backToLog.replace(/\..*/, '.');
      }
      return backLink;
    },
    addedCount() {
      if (this.count === 0) {
        return '';
      }
      return (this.count > 1) ? this.texts.searchResults.added.replace(/\{count\}/, this.count) : this.texts.searchResults.addedOne;
    },
  },
};
</script>

<style scoped>
.app-breadcrumbs {
  border-bottom: 1px solid #ccc;
  font-size: 14px;
  margin-bottom: 40px;
  padding: 20px;
}

.app-breadcrumbs a {
  text-decoration: none;
  text-transform: uppercase;
}

.app-breadcrumbs a svg {
  fill: currentColor;
}

.app-header {
  background: #f6f6f6;
  margin-bottom: 24px;
  padding: 24px;
}

.sle-app-header {
  margin-bottom: 32px;
}

.sle-app-header__title {
  font-size: 22px;
  font-weight: 700;
  line-height: 32px;
  margin: 0 0 8px;
  text-align: center;
}

.sle-app-header__subtitle {
  font-size: 14px;
  line-height: 22px;
  text-align: center;
}

.app-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 24px 60px;
}

.search-wrapper {
  margin-bottom: 48px;
}

.normalized .search-wrapper .input-group .form-control.input-large {
  font-size: 22px;
  height: 56px;
}
.search-wrapper .input-group .form-control.input-large+.input-suffix,
.search-wrapper .input-group .form-control.input-large:focus+.input-suffix,
.search-wrapper input-suffix {
  padding: 0 10px;
  line-height: 44px;
}

.nothing {
  text-align: center;
}

.nothing__image {
  max-width: 240px;
  margin: 0 auto 36px;
}

.nothing__image img {
  max-width: 100%;
}

.nothing__title {
  font-size: 22px;
  line-height: 32px;
}

.nothing__text {
  font-size: 14px;
  line-height: 22px;
  margin-bottom: 24px;
}

.nothing__link {
  font-size: 14px;
  line-height: 22px;
  text-decoration: none;
}

.search-result {
  align-items: baseline;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 16px;
}

.search-result__title {
  font-size: 18px;
  line-height: 28px;
  margin-bottom: 8px;
  white-space: nowrap;
}

.search-result__count {
  font-size: 14px;
  line-height: 22px;
  margin-bottom: 8px;
}

.search-result__count b {
  font-weight: 600;
}

.search-result__count a {
  text-decoration: none;
}

@media screen and (min-width: 768px) {
  .sle-app-header__title {
    font-size: 34px;
    line-height: 44px;
  }
  .sle-app-header__subtitle {
    font-size: 16px;
    line-height: 26px;
  }

  .nothing__title {
    font-size: 28px;
    line-height: 38px;
  }
  .nothing__link,
  .nothing__text {
    font-size: 16px;
    line-height: 26px;
  }
  .search-result__title {
    font-size: 22px;
    line-height: 32px;
  }
  .search-result__count {
    font-size: 16px;
    line-height: 26px;
  }
}
</style>
