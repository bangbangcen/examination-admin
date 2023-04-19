<script setup lang="ts">
import router from '../../../router/index';
import { store } from '@/store';
import { cloneDeep } from 'lodash';
import { watchEffect } from 'vue';
const tags = store.visitedViews;
watchEffect(() => {
  console.log(store.curView);
});

function closeTag(index: number, isSelected: boolean) {
  tags.splice(index, 1);
  console.log(cloneDeep(tags), isSelected)
  if (isSelected) {
    const lastTag = tags.length ? tags[tags.length - 1].path : '/examination';
    setTimeout(() => {
      router.push(lastTag);
    });
  }
}
</script>
<template>
  <div class="navigation-bar">
    <router-link v-for="(tag, index) in tags" :to="tag.path">
      <div class="tag" :class="{ active: store.curView === tag.component }" draggable="true">
        <span>{{ tag.name }}</span>
        <div class="close-wrapper">
          <Icon type="ios-close" size="18"/>
          <div class="close-btn" @click="closeTag(index, store.curView === tag.component)"></div>
        </div>
      </div>
    </router-link>  
  </div>
  <br>
</template>

<style lang="scss" scoped>
@import '../../../assets/theme.scss';

.navigation-bar {
  display: flex;
  align-items: flex-end;
  padding-top: 4px;
  background-color: $border;

  .active {
    background-color: white;
  }
  .tag {
    display: flex;
    justify-content: space-between;
    position: relative;
    top: 1px;
    margin: 0 4px 0 4px;
    padding: 4px 0 4px 8px;
    height: 29px;
    color: $content;
    border-radius: 6px 6px -6px -6px;
    border-radius: 2px 2px 0 0;
    transition: all 100ms ease-in;

    .close-wrapper {
      display: flex;
      position: relative;
      width: 20px;
      justify-content: center;
      align-items: center;
      
      .close-btn {
        align-items: center;    
        position: absolute;
        left: 50%;
        right: 50%;
        transform: translateX(-50%);
        width: 12px;
        height: 12px;
        border-radius: 10px;
      }

      .close-btn:hover {
        background-color: rgb(218, 218, 218);
      }
    }
  }

}


</style>
