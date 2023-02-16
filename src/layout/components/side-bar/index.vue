<script setup lang="ts">
import { store } from '@/store';
import { watch } from 'vue';
const { pmsTree } = store;
watch(() => store.sideBarIsOpen, (curVal, preVal) => {
  if (curVal === true) {
    (document.querySelector(".side-bar") as HTMLElement).style.width = "240px";
    (document.querySelectorAll(".ivu-menu")).forEach((el: any) => { el.style.width = "240px"; });
    document.querySelectorAll(".side-bar .ivu-menu-submenu").forEach((el: any) => { el.style.width = "240px"; });
    document.querySelectorAll(".ivu-menu-item").forEach((el: any) => { el.style.width = "240px"; });
    document.querySelectorAll(".side-bar .ivu-menu-submenu-title-icon").forEach((el: any) => { el.style.display = "block"; });
    setTimeout(() => {
      document.querySelectorAll(".side-bar span").forEach((el: any) => { el.style.display = "inline"; });
      (document.querySelector(".title") as HTMLElement).style.display = "block";
    }, 100);
  }
  else {
    document.querySelectorAll(".side-bar span").forEach((el: any) => { el.style.display = "none"; });
    (document.querySelector(".title") as HTMLElement).style.display = "none";
    (document.querySelector(".side-bar") as HTMLElement).style.width = "60px";
    (document.querySelectorAll(".ivu-menu")).forEach((el: any) => { el.style.width = "60px"; });
    document.querySelectorAll(".ivu-menu-item").forEach((el: any) => { el.style.width = "60px"; });
    document.querySelectorAll(".side-bar .ivu-menu-submenu").forEach((el: any) => { el.style.width = "60px"; });
    document.querySelectorAll(".side-bar .ivu-menu-submenu-title-icon").forEach((el: any) => { el.style.display = "none"; });
  }
});
</script>
<template>
  <div class="side-bar">
    <Menu class="menu" theme="dark">
      <template v-if="pmsTree && pmsTree.children">
        <template v-for="node in pmsTree.children">
          <MySubmenu :node="node"></MySubmenu>
        </template>
      </template>
    </Menu>
  </div>
</template>

<style lang="scss" scoped>
.side-bar {
  height: 100%;
  width: 240px;
  transition: width 0.2s ease-out;
  
  .menu {
    height: 100%;
  }
}
:deep(.ivu-menu, .side-bar span, .ivu-menu-item span, .ivu-menu-item) {
  transition: all 0.2s ease-out;
}
</style>
