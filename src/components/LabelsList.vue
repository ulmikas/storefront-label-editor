<template>
  <div class="labels-list">
    <div v-for="(label, key) in labels">
      <labels-list-item 
        :editable="editable" 
        :lang="lang" 
        :labelKey="key" 
        :labelValue="label" 
        :labelInitialValue="getInitial(key)" 
        :texts="texts"
        @add-label="addLabel" 
        @revert-label="revertLabel" />
    </div>
  </div>
</template>

<script>
  import LabelsListItem from './LabelsListItem';

  export default {
    name: 'labels-list',
    props: ['labels', 'lang', 'defaultLabels', 'editable', 'texts'],
    components: { LabelsListItem },
    data() {
      return {};
    },
    methods: {
      addLabel(e) {
        this.$emit('add-label', e);
      },
      revertLabel(key) {
        this.$emit('revert-label', key);
      },
      getInitial(key) {
        return this.defaultLabels[key];
      },
      isEmpty() {
        return Object.keys(this.labels).length === 0;
      },
      clearSearch() {
        this.$emit('clear-search');
      },
    },
  };
</script>

<style scoped>
</style>
