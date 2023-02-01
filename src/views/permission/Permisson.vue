<script setup lang="ts">
import $axios from "@/axios";
import { ref, reactive } from "vue";
import { Permission } from "@/model";

const columns = [
  {
    title: "权限名称",
    key: "name",
    slot: "name",
    tree: true,
  },
  {
    title: "路由名称",
    key: "routeName",
    slot: "routeName",
  },
  {
    title: "权限等级",
    key: "level",
  },
  {
    title: "操作",
    slot: "operation",
  },
];
let res = await $axios.get("permission/list");
let data = res.data.children;
let childParentMap = new Map();
let idPermissionMap = new Map();
let isEdit = ref(false);
let dataClone: any = null;

function collectMap(root: any) {
  idPermissionMap.set(root.id, root);
  if (root.children) {
    root.children.forEach((node: Permission) => {
      childParentMap.set(node.id, root);
      idPermissionMap.set(node.id, node);
      collectMap(node);
    });
  }
}

function edit() {
  dataClone = reactive(res.data);
  collectMap(dataClone);
  data = dataClone.children;
  isEdit.value = true;
}

function cancelEdit() {
  dataClone = null;
  data = res.data.children;
  isEdit.value = false;
}

function save() {
  $axios.post("permission/update", dataClone.children);
}

function del(row: Permission, index: number) {
  let parent = childParentMap.get(row.id);
  console.log(parent);
  parent._showChildren = true;
  parent.children.splice(index, 1);
}

function add(_row: Permission) {
  let row = idPermissionMap.get(_row.id);
  if (row.id !== 0) {
    row._showChildren = true;
    if (!row.children) row.children = [];
    row.children.push(new Permission(row));
  } else {
    row.children.push(new Permission(row));
  }
}
</script>

<template>
  <div>
    <div class="table-top">
      <Button v-if="!isEdit" class="button" type="primary" @click="edit()">
        <Icon type="md-create" size="20" />
        <span>编辑模式</span>
      </Button>
      <Button v-if="isEdit" class="button" type="warning" @click="cancelEdit()">
        <Icon type="md-return-left" size="20" />
        <span>退出编辑</span>
      </Button>
      <Button
        v-if="isEdit"
        class="button"
        type="primary"
        @click="add(dataClone)"
      >
        <Icon type="md-add" size="18" />
        <span>添加权限</span>
      </Button>
      <Button v-if="isEdit" class="button" type="success" @click="save()">
        <span>保存修改</span>
      </Button>
    </div>
    <Table
      v-columnWidth="[3, 3, 1, 1]"
      class="table"
      stripe
      draggable
      row-key="id"
      :columns="columns"
      :data="data"
    >
      <template #name="{ row, index }">
        <span v-if="!isEdit" draggable="true">{{ row.name }}</span>
        <Input v-if="isEdit" v-model="row.name"></Input>
      </template>
      <template #routeName="{ row, index }">
        <span v-if="!isEdit">{{ row.routeName }}</span>
        <Input v-if="isEdit" v-model="row.routeName"></Input>
      </template>
      <template #operation="{ row, index }">
        <div class="operation">
          <Button type="primary" :disabled="!isEdit" @click="add(row)">
            <Icon type="md-add" size="18" />
          </Button>
          <Button type="error" :disabled="!isEdit" @click="del(row, index)">
            <Icon type="md-trash" size="18" />
          </Button>
        </div>
      </template>
    </Table>
  </div>
</template>

<style lang="scss" scoped>
.table-top {
  margin-bottom: 16px;

  button {
    margin-right: 20px;
  }
}
</style>
