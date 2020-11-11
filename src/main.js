import Vue from "vue";
import App from "./App.vue";
import Buefy from "buefy";
import "buefy/dist/buefy.css";
import "vue-multiselect/dist/vue-multiselect.min.css";

Vue.use(Buefy, {
  defaultIconPack: "fas"
});

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App)
}).$mount("#app");
