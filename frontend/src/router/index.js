import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import GroupDetails from "../views/GroupDetails.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/group/:groupName",
    name: "GroupDetails",
    component: GroupDetails,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
