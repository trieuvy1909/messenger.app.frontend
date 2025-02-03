import { createRouter, createWebHistory } from "vue-router";
import AccessView from "@src/components/views/AccessView/AccessView.vue";
import HomeView from "@src/components/views/HomeView/HomeView.vue";
import PasswordResetView from "@src/components/views/PasswordResetView/PasswordResetView.vue";
import Chat from "@src/components/views/HomeView/Chat/Chat.vue";
import { signalRService } from '@src/services/signalRService';


const routes = [
  {
    path: "/chat/",
    name: "Home",
    alias: "/",
    component: HomeView,
    meta: { requiresAuth: true },
    children: [
      {
        path: "/chat/",
        alias: "/",
        name: "No-Chat",
        component: Chat,
      },
      {
        path: "/chat/:id/",
        name: "Chat",
        component: Chat,
      },
    ],
  },
  {
    path: "/access/:method/",
    name: "Access",
    component: AccessView,
    meta: { guest: true }
  },
  {
    path: "/reset/",
    name: "Password Reset",
    component: PasswordResetView,
    meta: { guest: true },
  },
];

// create the router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// (router gaurd) when navigating in mobile screen from chat to chatlist,
// don't navigate to the previous chat navigate to the chatlist.
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('user')
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({
        path: '/access/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  }
  
  if (to.meta.guest && isAuthenticated) {
    next('/chat')
  } else {
    next()
  }
  
  if (from.name === "Chat" && to.name === "Chat" && window.innerWidth <= 967)
    next({ name: "No-Chat" });
  else next();

  signalRService.startConnection();
});

export default router;
