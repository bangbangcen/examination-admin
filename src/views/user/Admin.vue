<script setup lang="ts">
import $axios from "@/axios";
import { reactive, toRaw, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance() as any;
const columns = [
  {
    title: "姓名",
    key: "name",
  },
  {
    title: "联系方式",
    key: "phone",
  },
  {
    title: "角色",
    key: "roleName",
  },
  {
    title: "创建时间",
    key: "createTime",
  },
];
const state = reactive({
  total: 0,
  admins: [] as [],
  isOpen: false,
  roles: [] as [],
});
const formState = reactive({
  name: "",
  phone: "",
  password: "",
  newRoleId: -1,
});
getAdmins(1);

function validatePhone(rule: any, value: any, callback: Function) {
  if (value === "") {
    callback(new Error("手机号不能为空"));
  } else {
    callback();
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

function validatePassword(rule: any, value: string, callback: Function) {
  if (value === "") {
    callback(new Error("密码不能为空"));
  } else {
    callback();
  }
}
const validateRules = {
  name: [{ required: true, validator: validateName, trigger: "blur" }],
  phone: [{ required: true, validator: validatePhone, trigger: "blur" }],
  password: [{ required: true, validator: validatePassword, trigger: "blur" }],
};
function formatTime() {
  state.admins.forEach((admin: any) => {
    admin.createTime = admin.createTime.slice(0, 19);
    admin.createTime = admin.createTime.replace("T", " ");
  });
}
async function getAdmins(page: number) {
  console.log(page);
  const adminRes = await $axios.post("/admin/page", { page, size: 6 });
  state.admins = adminRes.data.rows;
  state.total = adminRes.data.total;
  formatTime();
}
async function openModal() {
  state.isOpen = true;
  const roleRes = await $axios.get("/role/list");
  console.log(roleRes.data);
  state.roles = roleRes.data;
}
async function addAdmin() {
  await $axios.post("/admin/newAdmin", toRaw(formState));
  proxy.$Message.success({ content: "创建成功" });
  formState.name = "";
  formState.password = "";
  formState.phone = "";
  formState.newRoleId = -1;
  getAdmins(1);
}
</script>

<template>
  <Modal v-model="state.isOpen" title="新增用户" @on-ok="addAdmin()">
    <Form class="form" :model="formState" :label-width="80" :rules="validateRules">
      <FormItem label="用户姓名" prop="name" required="true">
        <Input v-model="formState.name" placeholder="请输入用户姓名"></Input>
      </FormItem>
      <FormItem label="联系方式" prop="phone" required="true">
        <Input v-model="formState.phone" placeholder="请输入用户联系方式"></Input>
      </FormItem>
      <FormItem label="密码" prop="password" required="true">
        <Input v-model="formState.password" placeholder="请输入用户密码"></Input>
      </FormItem>
      <FormItem label="用户角色" prop="newRoleId" required="true">
        <Select clearable style="width: 200px" v-model="formState.newRoleId">
          <Option v-for="(item, index) in state.roles" :value="item.id" :key="item.id"
            >{{ item.name }}
          </Option>
        </Select>
      </FormItem>
    </Form>
  </Modal>
  <Button class="button" type="primary" @click="openModal()"> 添加后台用户 </Button>
  <Table class="table" stripe :columns="columns" :data="state.admins"></Table>
  <div class="pagination">
    <Page :total="state.total" :page-size="6" @on-change="getAdmins($event)" />
  </div>
</template>

<style lang="scss" scoped>
.button {
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
