<script setup lang="ts">
import { reactive } from "vue";
import $axios from "@/axios";
import type { Role, PmsNode, Permission } from "@/model";
import { Input, Form, FormItem, TreeSelect } from "view-ui-plus";
import { cloneDeep, last } from "lodash";

let props = defineProps<{
  role: Role;
  isOpen: Boolean;
}>();
let lastSelectedIds: Array<number> = [];
type State = {
  lastSelectedIds: Array<number>;
  selectedIds: Array<number>;
  pmsList: Array<PmsNode>;
  role: Role;
  isOpen: Boolean;
};
let srcState: State = {
  lastSelectedIds: [],
  selectedIds: [],
  pmsList: [],
  role: cloneDeep(props.role),
  isOpen: props.isOpen,
};
let state = reactive(srcState);
let idPmsMap = {};
await getPmsTree();
// collectMap(state.pmsList[0]);
// console.log(idPmsMap)

function collectMap(root: PmsNode) {
  idPmsMap[root.id] = root;
  if (root.children) {
    root.children.forEach((node: PmsNode) => {
      collectMap(node);
    });
  }
}

async function getPmsTree() {
  let res = await $axios.get("/permission/list");
  let tree: PmsNode = res.data;
  prehandleTree(tree);
  state.pmsList.push(tree);
}

function prehandleTree(root: PmsNode) {
  if (root) {
    root.title = root.name;
    root.value = root.id;
    root.selected = false;
    root.checked = false;
    root.expand = true;
    if (root.children) {
      root.children.forEach((child: any) => {
        prehandleTree(child);
        child.parent = root;
      });
    }
  }
}

function validateName(rule: any, value: string, callback: Function) {
  if (value === "") {
    callback(new Error("角色名称不能为空"));
  } else if (value.length > 10) {
    callback(new Error("角色名称不能超过10个字"));
  } else if (!/^[^\x00-\xff]+$/.test(value)) {
    callback(new Error("角色名称只能为中文字符"));
  } else {
    callback();
  }
}

function validatePms(rule: any, value: any, callback: Function) {
  if (state.selectedIds.length === 0) {
    callback(new Error("权限不能为空"));
  } else {
    callback();
  }
}

function onSelectPms(pms: any) {
  console.log(pms);
}

const validateRules = {
  name: [{ required: true, validator: validateName, trigger: "blur" }],
  pms: [{ required: true, validator: validatePms, trigger: "change" }],
};

function submit() {
  console.log(state.lastSelectedIds);
}
</script>

<template>
  {{ isOpen }}
  <Modal v-model="state.isOpen" title="编辑角色" on-ok="submit()">
    <Form class="form" :model="state.role" :label-width="80" :rules="validateRules">
      <FormItem label="角色名称" prop="name">
        <Input v-model="state.role.name" placeholder="请输入角色名称"></Input>
      </FormItem>
      <FormItem label="备注">
        <Input
          v-model="state.role.description"
          type="textarea"
          placeholder="请输入角色备注"
        ></Input>
      </FormItem>
      <FormItem label="角色权限" prop="pms">
        <TreeSelect
          v-model="state.selectedIds"
          multiple
          show-checkbox
          :data="state.pmsList"
        />
      </FormItem>
    </Form>
  </Modal>
</template>

<style scoped></style>
