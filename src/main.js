import Vue from "vue";
// import "./plugins/axios";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import VueAxios from "vue-axios";

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);

new Vue({
  router,
  store,
  beforeCreate() {
    this.$store.commit("initFromStorage");
  },
  render: (h) => h(App),
}).$mount("#app");
