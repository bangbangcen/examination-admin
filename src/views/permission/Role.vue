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

// async function submit() {
//   if (status === 'add') {
//     $axios.post('/role/create', role);
//   }
//   if (status === 'edit') {
//     $axios.put('/role/update', state.selectedRole);
//   }
// }

function openModal(status: OP, role: Role) {
  state.isOpen = !state.isOpen;
  // role.description = "";
  // const title = status === OP.ADD ? "新建角色" : "编辑角色";
  // proxy.$Modal.confirm({
  //   title,
  //   render: (h: any) => {
  //     return h(Suspense, [
  //       h(EditRoleModal, {
  //         role,
  //       }),
  //     ]);
  //   },
  //   width: 700,
  //   cancelText: "取消",
  //   onOk: () => {
  //     console.log("333");
  //   },
  // });
}

async function deleteRole(row: any) {
  await $axios.post("role/delete", {
    deletedRoleId: row.id,
  });
  console.log(row.id);
  roleRes = await $axios.get("role/list");
  state.roles = roleRes.data;
}
</script>

<template>
  <Modal v-model="state.isOpen" title="adf">
    <div>sdfsdf</div>
  </Modal>
  <!-- <EditRoleModal :role="state.selectedRole" :isOpen="state.isOpen"></EditRoleModal> -->
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
  margin-bottom: 20px;
}
</style>
