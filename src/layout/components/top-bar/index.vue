<script setup lang="ts">
import { store } from '@/store';

function changeSideBarStatus() {
  store.sideBarIsOpen = !store.sideBarIsOpen;
}
</script>
<template>
  <div>
    <Icon class="menu-btn" size="28" type="md-menu" @click="changeSideBarStatus()"/> 
  </div>
</template>

<style lang="scss" scoped>
@import '../../../assets/theme.scss';

.top-bar {
  display: flex;
  align-items: center;

  .menu-btn {
    margin-left: 10px;
    cursor: pointer;
  }

  .menu-btn:hover {
    color: $primary;
  }
}
</style>
