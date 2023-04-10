<script setup lang="ts">
import $axios from "@/axios";
import { reactive } from "vue";

const columns = [
  {
    title: "姓名",
    key: "name",
  },
  {
    title: "身份证号",
    key: "identificationNumber",
  },
  {
    title: "性别",
    key: "sex",
  },
  {
    title: "手机号",
    key: "phone",
  },
  {
    title: "创建时间",
    key: "createTime",
  },
];
const state = reactive({
  users: [],
  total: 0,
  keyword: "",
});
getUsers(1);
async function getUsers(page: number) {
  const userRes = await $axios.post("/user/page", { page, size: 6 });
  state.users = userRes.data.rows;
  state.total = userRes.data.total;
  formatTime();
}

function formatTime() {
  state.users.forEach((admin: any) => {
    admin.createTime = admin.createTime.slice(0, 19);
    admin.createTime = admin.createTime.replace("T", " ");
  });
}

async function searchUsers() {
  const userRes = await $axios.post("/user/search", {
    page: 1,
    size: 6,
    keyword: state.keyword,
  });
  state.users = userRes.data.rows;
  state.total = userRes.data.total;
  formatTime();
}
</script>

<template>
  <Input
    placeholder="请输入任何信息以搜索"
    class="search"
    @on-blur="searchUsers()"
    v-model="state.keyword"
  >
    <template #suffix>
      <Icon type="ios-search" />
    </template>
  </Input>
  <Table class="table" stripe :columns="columns" :data="state.users"></Table>
  <div class="pagination">
    <Page :total="state.total" :page-size="6" @on-change="getUsers($event)" />
  </div>
</template>

<style lang="scss" scoped>
.search {
  width: auto;
  margin: 20px 20px 0 20px;
}
.table {
  margin: 20px;
}
.pagination {
  text-align: right;
  padding-right: 100px;
}
</style>
