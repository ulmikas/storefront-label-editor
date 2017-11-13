<template>
  <div :class="['sle-lang-select', 'btn-group', 'dropdown-toggle', {opened}]" v-click-outside="closeDropdown" @click="openDropdown">
    <div :class="'btn btn-default btn-dropdown btn-' + size">
      <span class="btn-dropdown-container">
        <span class="filter-label">{{ selected }}</span>
      </span>
      <span class="icon-arr-down"></span>
    </div>
    <div class="list-dropdown list-dropdown-large">
        <ul @click="setLang">
          <li v-for="lang in orderedLangs">
            <a href="#" v-bind:rel="lang.code">
              {{ lang.name }}
            </a>
          </li>
        </ul>
    </div>
  </div>
</template>

<script>
// import ClickOutside from 'vue-click-outside';
const ClickOutside = require('../vue-click-outside');

export default {
  name: 'select-lang',
  props: ['texts', 'langs', 'usedLangs', 'lang', 'size'],
  data() {
    return {
      selected: this.lang,
      opened: false,
    };
  },
  methods: {
    setLang(e) {
      e.preventDefault();
      this.opened = false;
      this.selected = e.target.rel;
      this.$emit('set-lang', e);
    },
    openDropdown() {
      this.opened = true;
      /* global EcwidApp:true */
      /* eslint no-undef: "error" */
      EcwidApp.setSize({
        height: Math.max((this.langs.length * 58) + 250, this.$parent.$el.offsetHeight),
      });
    },
    closeDropdown() {
      this.opened = false;
      /* global EcwidApp:true */
      /* eslint no-undef: "error" */
      EcwidApp.setSize({ height: this.$parent.$parent.$el.offsetHeight });
    },
  },
  computed: {
    orderedLangs() {
      const used = this.langs.filter(l => this.usedLangs.indexOf(l.code) !== -1);
      const notUsed = this.langs.filter(l => this.usedLangs.indexOf(l.code) === -1);
      return [...used, ...notUsed];
    },
  },
  directives: {
    ClickOutside,
  },
};
</script>

<style scoped>
  .search-lang-select {
    border: 1px solid transparent;
    background-color: #e9e9e9;
    background-clip: padding-box;
    box-sizing: border-box;
    position: absolute;
    top: 0;
    right: 0;
    padding: 1px;
    height: 56px;
  }
  .sle-lang-select .btn {
    min-width: 0;
  }
  .btn-group > .btn:first-child:not(:last-child):not(.dropdown-toggle) {
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
  }

  .search-lang-select .btn,
  .search-lang-select .btn:focus,
  .search-lang-select .btn:active,
  .search-lang-select.opened .btn.btn-dropdown,
  .search-lang-select.opened .btn:not([disabled]) + .btn.btn-dropdown {
    border: none;
    background: none;
    height: 52px;
    padding: 15px 16px;
  }

  .search-lang-select .btn:not([disabled]) + .btn-default.btn-dropdown:focus{
    background-color: #f5f5f5;
  }
  .form-control:focus + .search-lang-select {
    background-color: #c6e7fa;
    border-width: 2px;
    padding: 0 0 0 1px;
  }

</style>
