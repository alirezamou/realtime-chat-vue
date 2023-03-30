import { createRouter, createWebHistory } from "vue-router";

import Login from "@/components/Login.vue";

import { FirebaseAuth } from "@/library/Database";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: "Login",
      path: "/",
      component: Login,
    },
  ],
});

router.beforeEach((to, _from, next) => {
  let auth = FirebaseAuth;

  if (auth.currentUser === null && to.path !== "/login") {
    next({
      path: "/",
    });
  } else {
    next();
  }
});

export default router;
