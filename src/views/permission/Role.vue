<script setup lang="ts">
import $axios from "@/axios";
import { cloneDeep } from "lodash";
import { reactive, getCurrentInstance, Suspense } from "vue";
import { Role, OP } from "@/model";

const { proxy } = getCurrentInstance() as any;
let roleRes = await $axios.get("role/list");
let state = reactive({
  isOpen: false,
  modalTitle: "",
  selectedRole: new Role(),
  pmsTree: [],
  selectedPms: [],
  roles: roleRes.data,
  mode: 0,
});
let formState = reactive({
  pmsList: [],
  role: {
    name: "",
    description: "",
    selectedIds: [] as any,
  },
});

getPmsTree();
const columns = [
  {
    title: "角色名称",
    key: "name",
    width: 300,
  },
  {
    title: "备注",
    key: "description",
    width: 500,
  },
  {
    title: "操作",
    slot: "operation",
    width: 400,
  },
];

async function submit() {
  if (state.mode === OP.ADD) {
    $axios.post("/role/create", formState.role);
  }
  if (state.mode === OP.EDIT) {
    $axios.put("/role/update", formState.role);
  }
  getRoles();
}

async function getRoles() {
  const roleRes = await $axios.get("role/list");
  state.roles = roleRes.data;
}
function prehandleTree(root: any) {
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

async function getPmsTree() {
  let res = await $axios.get("/permission/list");
  let tree: any = res.data;
  prehandleTree(tree);
  formState.pmsList.push(tree);
}

async function openModal(status: OP, role: any) {
  state.mode = status;
  state.isOpen = true;
  if (state.mode === OP.ADD) {
    formState.role = {
      name: "",
      description: "",
      selectedIds: [],
    };
  } else {
    formState.role = role;
    const PmsList = await $axios.get(`permission/listByRole/${role.id}`);
    selectPmsIds();
  }
}

function selectPmsIds() {
  function dfs(node: any) {
    if (formState.role.selectedIds.includes(node.id)) {
      node.selected = true;
    }
    if (node.children) {
      node.children.forEach((child: any) => {
        dfs(child);
      });
    }
  }
  dfs(formState.pmsList[0]);
}

async function deleteRole(row: any) {
  await $axios.post("role/delete", {
    deletedRoleId: row.id,
  });
  console.log(row.id);
  roleRes = await $axios.get("role/list");
  state.roles = roleRes.data;
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
  if (formState.role.selectedIds.length === 0) {
    callback(new Error("权限不能为空"));
  } else {
    callback();
  }
}

const validateRules = {
  name: [{ required: true, validator: validateName, trigger: "blur" }],
  pms: [{ required: true, validator: validatePms, trigger: "change" }],
};

function onSelectTree($event: any) {
  console.log($event);
}
</script>

<template>
  <Modal v-model="state.isOpen" title="编辑角色" @on-ok="submit()">
    <Form class="form" :model="formState.role" :label-width="80" :rules="validateRules">
      <FormItem label="角色名称" prop="name">
        <Input v-model="formState.role.name" placeholder="请输入角色名称"></Input>
      </FormItem>
      <FormItem label="备注">
        <Input
          v-model="formState.role.description"
          type="textarea"
          placeholder="请输入角色备注"
        ></Input>
      </FormItem>
      <FormItem label="角色权限" prop="pms">
        <TreeSelect
          v-model="formState.role.selectedIds"
          multiple
          show-checkbox
          @on-change="($event: any) => onSelectTree($event)"
          :data="formState.pmsList"
        />
      </FormItem>
    </Form>
  </Modal>
  <div>
    <div class="table-top">
      <Button class="button" type="primary" @click="openModal(OP.ADD, new Role())">
        <Icon type="md-create" size="20" />
        <span>添加角色</span>
      </Button>
    </div>
    <Table class="table" stripe :columns="columns" :data="state.roles">
      <template #operation="{ row, index }">
        <div class="operation">
          <Button type="primary" @click="openModal(OP.EDIT, row)">
            <Icon type="md-create" size="18" />
          </Button>
          <Button type="error" @click="deleteRole(row)">
            <Icon type="md-trash" size="18" />
          </Button>
        </div>
      </template>
    </Table>
  </div>
</template>

<style lang="scss">
.table-top {
  margin: 20px 20px 0 20px;
}
.table {
  margin: 20px;
}
</style>
