import Vue from "vue";
import App from "./App.vue";
import store from "./store";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faMapMarked } from "@fortawesome/free-solid-svg-icons";
import { faFlickr } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faMapMarked, faFlickr);

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
