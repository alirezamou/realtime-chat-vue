import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "bulma/css/bulma.css";

import { FirebaseAuth } from "@/library/Database";
import { onAuthStateChanged } from "firebase/auth";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faIcons } from "@fortawesome/free-solid-svg-icons";

library.add(faIcons);

let baseApp;

onAuthStateChanged(FirebaseAuth, () => {
  if (!baseApp) {
    const baseApp = createApp(App);
    baseApp.component("fa-icon", FontAwesomeIcon);
    baseApp.use(router);
    baseApp.use(store);
    baseApp.mount("#app");
  }
});
