<script setup lang="ts">
import $axios from "@/axios";
import MyTable from "@/components/MyTable/MyTable.vue";
import { ref, toRaw, reactive, watch } from "vue";
import { cloneDeep } from "lodash";
import { traverse } from "@/utils";
import { proxy } from "@/main";

const columns = [
  {
    title: "权限名称",
    key: "name",
    flex: 2,
    editable: true,
  },
  {
    title: "路由名称",
    key: "path",
    flex: 2,
  },
  {
    title: "权限等级",
    key: "level",
    flex: 2,
  },
];
let state = reactive({
  data: [],
});
let res = await $axios.get("permission/list");
state.data = reactive(res.data.children);
let isEdit = ref(false);
const table = ref();
console.log(table);

watch(isEdit, (newValue) => {
  if (!newValue) {
    state.data = reactive(res.data.children);
  } else {
    state.data = reactive(cloneDeep(res.data.children));
  }
});

function edit() {
  isEdit.value = true;
}

function cancelEdit() {
  isEdit.value = false;
}

function save() {
  let updatedData = toRaw(state.data);
  let pmslist: any = [];
  traverse(updatedData, (node: any) => {
    delete node.arr;
    pmslist.push(node);
  });
  $axios
    .post("permission/update", toRaw(pmslist))
    .then(async (res) => {
      proxy.$Message.success({ content: res.data.message });
      isEdit.value = false;
      res = await $axios.get("permission/list");
      state.data = reactive(res.data.children);
      setTimeout(() => {
        table.value.setProps();
        table.value.setTableRowStyle();
      });
    })
    .catch((res) => {
      proxy.$Message.error({ content: res });
    });
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
      <Button v-if="isEdit" class="button" type="success" @click="save()">
        <span>保存修改</span>
      </Button>
    </div>
    <MyTable
      class="myTable"
      :columns="columns"
      :data="state.data"
      :fit="true"
      :edit="isEdit"
      ref="table"
    >
      <template #name="{ row, index }">
        <span v-if="!isEdit" draggable="true">{{ row.name }}</span>
        <Input v-if="isEdit" v-model="row.name"></Input>
      </template>
      <template #routeName="{ row, index }">
        <span v-if="!isEdit">{{ row.routeName }}</span>
        <Input v-if="isEdit" v-model="row.routeName"></Input>
      </template>
    </MyTable>
  </div>
</template>

<style lang="scss">
.table-top {
  margin-bottom: 16px;

  button {
    margin-right: 20px;
  }
}

.myTable tr {
  display: flex;
}
</style>
