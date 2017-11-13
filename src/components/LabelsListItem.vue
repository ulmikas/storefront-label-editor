<template>
  <div v-bind:class="['labels-list-item', isEmpty ? 'labels-list-item--empty' : '', isDisabled ? '' : 'labels-list-item--changed', this.lang == 'ru' ? 'ru' : '' ]">
    <label class="labels-list-item__key" :for="`${lang}:${labelKey}`">{{ labelKey }}:</label>
    <div class="labels-list-item__input" :data-save="texts['saved']">
      <input :readonly="!editable" class="form-control input-medium" :id="`${lang}:${labelKey}`" :value="labelValue" @change="addLabel" v-on:keyup="debounceAddLabel" />
    </div>
    <button :class="[ editable ? 'labels-list-item__revert' : 'labels-list-item__revert labels-list-item__revert--disabled']" @click="revertLabel(labelKey)" :disabled="isDisabled">
      <span class="text">{{ texts.revert }}</span>
    </button>
  </div>
</template>

<script>
import debounce from 'debounce';

export default {
  name: 'labels-list-item',
  props: ['lang', 'labelKey', 'labelValue', 'labelInitialValue', 'texts', 'editable'],
  data() {
    return {};
  },
  methods: {
    addLabel(e) {
      const item = e.target;
      item.parentElement.classList.add('labels-list-item__input--saving');
      setTimeout(() => { item.parentElement.classList.remove('labels-list-item__input--saving'); }, 1000);
      if (e.target.value === this.labelInitialValue) {
        this.$emit('revert-label', e.target.id.match(/:(.*)$/)[1]);
      } else {
        this.$emit('add-label', e);
      }
    },
    debounceAddLabel: debounce(function debounceAddLabel(e) {
      this.addLabel(e);
    }, 1000),
    revertLabel(key) {
      this.$emit('revert-label', key);
    },
  },
  computed: {
    isEmpty() {
      return this.labelValue === '';
    },
    isDisabled() {
      return this.labelValue === this.labelInitialValue;
    },
  },
};
</script>

<style scoped>
.labels-list-item {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  margin-bottom: 16px;
  position: relative;
}

.labels-list-item__key {
  color: #999;
  font-size: 14px;
  flex-basis: 100%;
  margin-bottom: 4px;
}

.labels-list-item__input {
  flex: 1;
  font-size: 14px;
  width: auto;
  position: relative;
}

.labels-list-item__input--saving input.form-control {
  border-color: green;
  transition: border-color 200ms ease-out;
}

.labels-list-item__input--saving::after {
  content: attr(data-save);
  font-size: 11px;
  color: #999;
  display: block;
  position: absolute;
  top: 90%;
  right: 0;
}

.labels-list-item__revert {
  border: none;
  border-radius: 3px;
  background: none;
  cursor: pointer;
  font-size: 14px;
  margin-left: 10px;
  height: 32px;
}

.labels-list-item__revert .text {
  opacity: 1;
  transition: opacity 200ms ease-out;
}

.labels-list-item__revert:hover .text {
  color: #999;
  transition: color 200ms ease-out;
}

.labels-list-item__revert--disabled {
  cursor: auto;
}

.labels-list-item__revert[disabled] .text,
.labels-list-item__revert--disabled .text {
  opacity: 0;
}

.labels-list-item--changed .labels-list-item__key {
  color: #333;
  font-weight: 600;
}

.not-editable .labels-list-item__key {
  color: #777;
}

.not-editable .form-control[readonly] {
  color: #999;
}

@media screen and (min-width: 768px) {
  .labels-list-item__key {
    /*font-size: 16px;*/
    flex: 1;
    margin-bottom: 0;
    padding-right: 20px;
    word-break: break-word;
  }
  .labels-list-item__input {
    flex: 2;
  }
  .labels-list-item__revert {
    margin-left: 20px;
  }
}
</style>
