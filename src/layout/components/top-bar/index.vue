<script setup lang="ts">
import { store } from "@/store";
import router from "@/router";

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
