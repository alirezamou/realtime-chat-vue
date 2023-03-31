import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "bulma/css/bulma.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";

library.add(faLocationArrow);

let app = createApp(App);
app.component("fa-icon", FontAwesomeIcon);
app.use(router);
app.use(store);
app.mount("#app");
