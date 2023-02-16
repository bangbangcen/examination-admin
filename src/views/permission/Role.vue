<script setup lang="ts">
import $axios from "@/axios";
import { cloneDeep } from "lodash";
import { reactive, getCurrentInstance, Suspense } from "vue";
import { Role, OP } from "@/model";
import EditRoleModal from "@/components/modals/EditRoleModal.vue";

const { proxy } = getCurrentInstance() as any;
let roleRes = await $axios.get("role/list");
let state = reactive({
  isOpen: false,
  modalTitle: "",
  selectedRole: new Role(),
  pmsTree: [],
  selectedPms: [],
  roles: roleRes.data,
});
const columns = [
  {
    title: "角色名称",
    key: "name",
  },
  {
    title: "备注",
    key: "description",
  },
  {
    title: "操作",
    slot: "operation",
  },
];

// async function submit() {
//   if (status === 'add') {
//     $axios.post('/role/create', role);
//   }
//   if (status === 'edit') {
//     $axios.put('/role/update', state.selectedRole);
//   }
// }

function openModal(status: OP, role: Role) {
  role.description = "";
  const title = status === OP.ADD ? "新建角色" : "编辑角色";
  proxy.$Modal.confirm({
    title,
    render: (h: any) => {
      return h(Suspense, [
        h(EditRoleModal, {
          role,
        }),
      ]);
    },
    width: 700,
    cancelText: "取消",
  });
}

function deleteRole() {}
</script>

<template>
  <div>
    <div class="table-top">
      <Button
        class="button"
        type="primary"
        @click="openModal(OP.ADD, new Role())"
      >
        <Icon type="md-create" size="20" />
        <span>添加角色</span>
      </Button>
    </div>
    <Table
      v-columnWidth="[2, 6, 1]"
      class="table"
      stripe
      :columns="columns"
      :data="state.roles"
    >
      <template #operation="{ row, index }">
        <div class="operation">
          <Button type="primary" @click="openModal(OP.EDIT, row)">
            <Icon type="md-create" size="18" />
          </Button>
          <Button type="error" @click="deleteRole()">
            <Icon type="md-trash" size="18" />
          </Button>
        </div>
      </template>
    </Table>  
  </div>
</template>

<style lang="scss" scoped>
.table-top {
  margin-bottom: 20px;
}
</style>
