<template>
  <div id="app" class="welcome-page">
    <h1 class="welcome-page__title">{{ texts.title }}</h1>
    <div class="welcome-page__subtitle">{{ texts.description }}</div>
    <div class="fb-messenger-promo">
      <button type="button" class="btn btn-primary btn-large welcome-page__btn" @click="showSearch">
        <span class="svg-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" focusable="false">
            <path d="M6.712 5.314H11v1.39H6.712V11H5.267V6.706H1V5.314h4.267V1h1.446v4.314z"></path>
          </svg>
        </span>
        <span>{{ texts.addLabel }}</span>
      </button>
    </div>
    <div class="app-promo">
      <div class="app-promo__image">
        <img alt="app-promo__screenshot" src="../assets/welcome-image.png">
      </div>
      <div class="app-promo__features">
        <div class="app-feature" v-for="item in texts.appPromo">
          <div class="app-feature__title">{{ item.dt }}</div>
          <div class="app-feature__text">{{ item.dd }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'welcome-screen',
  props: ['texts'],
  data() {
    return {};
  },
  methods: {
    showSearch() {
      this.$emit('show-search');
    },
  },
};
</script>

<style scoped>
.welcome-page {
  padding: 16px 16px 1px;
}

.welcome-page * {
  box-sizing: border-box;
}

.welcome-page__title {
  font-size: 22px;
  line-height: 32px;
  font-weight: 700;
  margin: 0 auto 8px;
  text-align: center;
}

.welcome-page__subtitle {
  font-size: 14px;
  line-height: 22px;
  margin: 0 auto 32px;
  max-width: 800px;
  text-align: center;
}

.welcome-page__btn {
  font-size: 14px;
  padding: 9px 12px;
  border-radius: 3px;
  line-height: 1.45;
  height: 40px;
  min-width: 238px;
  display: block;
  margin: 0 auto 48px;
}

.welcome-page__btn .svg-icon {
  width: 22px;
}

.app-promo {
  align-items: flex-start;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.app-promo__image {
  margin-bottom: 16px;
  margin-top: 48px;
  text-align: center;
}

.app-promo__image img {
  max-height: 512px;
  max-width: 100%;
}

.app-promo__screenshot {
  max-height: 512px;
  max-width: 100%;
}

.app-promo__features {
  text-align: center;
}

.app-feature {
  color: #333;
  margin-bottom: 32px;
}

.app-feature__title {
  font-size: 16px;
  line-height: 26px;
  font-weight: 600;
  margin-bottom: 8px;
}

.app-feature__text {
  font-size: 14px;
  line-height: 24px;
}

@media screen and (min-width: 768px) {
  .welcome-page {
    padding-top: 24px;
    padding-bottom: 50px;
  }
  .welcome-page__title {
    font-size: 34px;
    line-height: 44px;
  }
  .welcome-page__subtitle {
    font-size: 16px;
    line-height: 26px;
  }
  .welcome-page__btn {
    font-size: 17px;
    padding: 11px 16px;
    border-radius: 5px;
    line-height: 1.45;
    height: 48px;
    min-width: 256px;
  }
  .app-promo {
    margin: 0 auto 48px;
    max-width: 970px;
  }
  .app-promo__image {
    padding-right: 16px;
    margin-bottom: 0;
    width: 50%;
  }
  .app-promo__features {
    padding-left: 16px;
    padding-top: 48px;
    text-align: left;
    width: 50%;
  }
  .app-feature {
    color: #333;
    margin-bottom: 32px;
  }
  .app-feature__title {
    font-size: 18px;
    line-height: 28px;
  }
}
</style>
