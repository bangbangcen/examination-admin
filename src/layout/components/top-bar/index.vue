<script setup lang="ts">
import { store } from "@/store";
import router from "@/router";
import $axios from "@/axios";
import { forEach } from "lodash";
import { ref, reactive, getCurrentInstance, Suspense} from "vue";

const uname=localStorage.getItem('uname');

function changeSideBarStatus() {
  store.sideBarIsOpen = !store.sideBarIsOpen;
}

function exit() {
  localStorage.removeItem("token");
  router.push("/login");
  store.pmsTree = null;
}
</script>
<template>
  <div class="flex">
    <Icon class="menu-btn" size="28" type="md-menu" @click="changeSideBarStatus()" />
    <b style="font-size: 20px;color:blue;">当前登录用户：{{ uname }}</b>
    <Button @click="exit()">登出</Button>
  </div>
</template>

<style lang="scss" scoped>
@import "../../../assets/theme.scss";
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}
.top-bar {
  display: flex;
  align-items: center;

  .menu-btn {
    cursor: pointer;
  }

  .menu-btn:hover {
    color: $primary;
  }
}
</style>
