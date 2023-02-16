<script setup lang="ts">
import { store } from '@/store';
import router from '../../../router/index';
import { ICON_TYPES } from '../../../constants';

const props = defineProps(["node"]);
const { node } = props;
function jump(node: any) {
  console.log(store);
  router.push(node.path);
  if (!store.visitedViews.includes(node)) {
    store.visitedViews.push(node);
  }
}
</script>
<template>
  <Submenu v-if="node.children" :name="node.id">
    <template #title>
      <Icon :type="ICON_TYPES[node.icon]" />
      <span>{{ node.name }}</span>
    </template>
    <MySubmenu v-for="(_node, index) in node.children" :node="_node">
    </MySubmenu>
  </Submenu>
  <MenuItem v-if="!node.children" @click="jump(node)" :name="node.id">
    <Icon :type="ICON_TYPES[node.icon]" />
    <span>{{ node.name }}</span>
  </MenuItem>
</template>
<style lang="scss" scoped>
.side-bar {
  height: 100%;

  .menu {
    height: 100%;
  }
}
</style>
