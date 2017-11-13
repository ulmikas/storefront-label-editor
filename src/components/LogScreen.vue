<template>
  <div class="app-log-screen">
    <div class="app-container">  
      <header class="sle-app-header">
        <div class="sle-app-header__titles">
          <h1 class="sle-app-header__title">{{ texts.logTitle }}</h1>
          <div class="sle-app-header__subtitle">{{ texts.logSubtitle }}</div>
        </div>
      </header>

      <button type="button" class="btn btn-primary btn-large sle-add-label-btn" @click="showSearch">
        <span class="svg-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" focusable="false"><path d="M6.712 5.314H11v1.39H6.712V11H5.267V6.706H1V5.314h4.267V1h1.446v4.314z"></path></svg>
        </span>
        {{ texts.addLabel }}
      </button>
  
      <div key="changedLabels">
        <LabelsList :editable="true" :lang="lang" :labels="changed" :texts="texts" :defaultLabels="defaultLabels" @add-label="addLabel" @revert-label="revertLabel" />
        <div class="not-editable" v-if="otherLangs.length">
          <div v-for="lang in otherLangs">
            <strong>{{ getLangName(lang) }}</strong>
            <LabelsList :editable="false" :lang="lang" :labels="stored[lang]" :texts="texts" :defaultLabels="defaultLabels" />
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import LabelsList from './LabelsList';
import getLangsNames from '../getLangs';

export default {
  name: 'log-screen',
  props: ['texts', 'count', 'totalCount', 'lang', 'langs', 'multilang', 'usedLangs', 'changed', 'stored', 'defaultLabels'],
  components: { LabelsList },
  data() {
    return {};
  },
  methods: {
    addLabel(e) {
      this.$emit('add-label', e);
    },
    showSearch() {
      this.$emit('show-search');
    },
    revertLabel(key) {
      this.$emit('revert-label', key);
    },
    getLangName(l) {
      return getLangsNames()[l];
    },
    setLang(e) {
      this.$emit('set-lang', e);
    },
  },
  computed: {
    otherLangs() {
      return ((this.multilang || this.usedLangs.length > 1) && Object.keys(this.stored).filter(i =>
        i !== this.lang && Object.keys(this.stored[i]).length > 0)) || [];
    },
  },
};
</script>

<style scoped>
.app-log-screen {
  padding: 16px 0 40px;
}
.app-log-screen * {
  box-sizing: border-box;
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

.sle-add-label-btn {
  font-size: 14px;
  padding: 9px 12px;
  border-radius: 3px;
  line-height: 1.45;
  height: 40px;
  min-width: 238px;
  display: block;
  margin: 0 auto 48px;
}

.sle-add-label-btn .svg-icon {
  width: 22px;
}

.app-log-screen strong {
  display: block;
  margin-bottom: 8px;
}
.app-log-screen .not-editable {
  margin-top: 48px;
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

  .sle-add-label-btn {
    font-size: 17px;
    padding: 11px 16px;
    border-radius: 5px;
    line-height: 1.45;
    height: 48px;
    min-width: 256px;
  }
  .app-log-screen {
    padding-top: 24px;
  }
}
</style>
