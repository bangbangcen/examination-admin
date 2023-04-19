import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { cloneDeep } from "lodash";
import $axios from "@/axios";
import { store } from "../store/index";

const COMPONENTS = {
  Layout: () => import("../layout/index.vue"),
  Login: () => import("../views/login/index.vue"),
  Center: () => import("../views/center/Center.vue"),
  Department: () => import("../views/department/Department.vue"),
  Department9: () => import("../views/department/Department9.vue"),
  Department10: () => import("../views/department/Department10.vue"),
  Department14: () => import("../views/department/Department14.vue"),
  Department16: () => import("../views/department/Department16.vue"),
  Department17: () => import("../views/department/Department17.vue"),
  Department19: () => import("../views/department/Department19.vue"),
  Department24: () => import("../views/department/Department24.vue"),
  Department25: () => import("../views/department/Department25.vue"),
  Order: () => import("../views/order/Order.vue"),
  GroupOrder: () => import("../views/order/GroupOrder.vue"),
  Package: () => import("../views/package/Package.vue"),
  Category: () => import("../views/package/Category.vue"),
  Permission: () => import("../views/permission/Permisson.vue"),
  Role: () => import("../views/permission/Role.vue"),
  User: () => import("../views/user/User.vue"),
  Admin: () => import("../views/user/Admin.vue")
};
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    name: "Login",
    path: "/login",
    component: () => import("../views/login/index.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
});

function toRoutes(root: any) {
  root.name = root.component;
  root.component = COMPONENTS[root.name];
  delete root.parentId;
  delete root.id;
  delete root.level;
  if (root.children && root.children.length) {
    root.children.forEach((child: any) => {
      toRoutes(child);
    });
  }
  return root;
}

router.beforeEach(async (to, from, next) => {
  if (to.name === "Login") {
    next();
  } else {
    if (store.pmsTree) {
      store.curView = to.name as string;
      next();
    } else {
      const res = await $axios.get("permission/list");
      store.pmsTree = res.data;
      const dynamicRoutes = toRoutes(cloneDeep(res.data));
      router.addRoute(dynamicRoutes);
      router.push({ ...to, replace: true });
      next();
    }
  }
});

export default router;
