<script setup lang="ts">
import Logo from "./components/logo/Logo.vue";
import SideBar from "./components/side-bar/index.vue";
import NavigationBar from "./components/navigation-bar/index.vue";
import TopBar from "./components/top-bar/index.vue";

</script>

<template>
  <div class="layout">
    <div class="left-part">
      <Logo class="logo"></Logo>
      <SideBar class="side-bar"></SideBar>
    </div>
    <div class="main-view">
      <TopBar class="top-bar">
      </TopBar>
      <NavigationBar class="navigation-bar"></NavigationBar>
      <Suspense>
        <router-view class="router-view" v-slot="{ Component }">
          <keep-alive>
            <component :is="Component"></component>
          </keep-alive>
        </router-view>
      </Suspense>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../assets/theme.scss";
.layout {
  display: flex;
  height: 100%;

  .left-part {
    .logo {
      height: 80px;
    }
  }

  .main-view {
    flex: 1;
    border-top: 1px solid $border;

    .top-bar {
      height: 46px;
    }
    .navigation-bar {
      height: 36px;
    }
    // .router-view {
    //   padding: 20px;
    // }
  }
}
</style>
