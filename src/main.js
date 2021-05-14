import Vue from "vue";
// import "./plugins/axios";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import VueAxios from "vue-axios";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);

new Vue({
  router,
  store,

  beforeCreate() {
    this.$store.commit("initFromStorage");
  },

  vuetify,
  render: (h) => h(App),
}).$mount("#app");
