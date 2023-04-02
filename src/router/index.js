import { createRouter, createWebHistory } from "vue-router";

import Login from "@/components/Login.vue";
import ChatRoom from "@/components/ChatRoom.vue";

import { FirebaseAuth } from "@/library/Database";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: "Login",
      path: "/",
      component: Login,
    },
    {
      name: "ChatRoom",
      path: "/chat",
      component: ChatRoom,
    },
    {
      path: "/chat/:slug",
      component: ChatRoom,
    },
  ],
});

router.beforeEach((to, _from, next) => {
  let auth = FirebaseAuth;

  if (auth.currentUser === null && to.path !== "/") {
    next({
      path: "/",
    });
  } else if (auth.currentUser !== null && to.path === "/") {
    next({
      path: "/chat",
    });
  } else {
    next();
  }
});

export default router;
