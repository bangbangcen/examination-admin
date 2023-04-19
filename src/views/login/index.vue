<script setup lang="ts">
import $axios from '@/axios';
import router from '@/router';
import { reactive, getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance() as any;
const state = reactive({
  info: {
    username: "李佳晨",
    password: "123456"
  }
});
function validateEmpty(rule: any, value: string, callback: Function) {
  if (value.length === 0) {
    callback(new Error("不能为空"));
  }
  else callback();
}

const validateRules = {
  username: [{ validator: validateEmpty, trigger: "blur" }],
  password: [{ validator: validateEmpty, trigger: "blur" }],  
};

function login() {
  if (!info.username || !info.password) {
    proxy.$Message.error({ content: "用户名和密码都不能为空！" });
    return;
  }
  $axios.post('/login', info)
    .then(res => {
      const data = res.data;
      if (data.login) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('uid', data.id);
        localStorage.setItem('uname', info.username);
        proxy.$Message.success({ content: data.message });
        setTimeout(() => {
          router.push('/role');
        }, 800);
      }
      else {
        proxy.$Message.error({ content: data.message });
      }
    })
    .catch(error => {
      proxy.$Message.error({ content: error.message });
    });
}

const info = state.info;
</script>

<template>
  <div class="background">
    <Card class="card" shadow>
      <div class="card-title">健康智慧体检平台后台管理系统</div>
      <Form
        class="form"
        :rules="validateRules"
        :model="info"
        :label-width="80"
      >
        <FormItem label="用户名" prop="username">
          <Input v-model="info.username" placeholder="请输入用户名"></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input type="password" v-model="info.password" placeholder="请输入密码"></Input>
        </FormItem>
      </Form>
      <div class="card-bottom">
        <Button type="primary" @click="login()">登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录</Button>
      </div>
    </Card>
  </div>
</template>

<style lang="scss" scoped>
.background {
  height: 100%;
  background-color: #f8f8f9;
  padding-top: 400px;

  .card {
    width: 500px;
    height: 270px;
    margin: 0 auto;

    .card-title {
      margin: 20px 0 40px;
      text-align: center;
      font-size: 18px;
      color: #2d8cf0;
    }

    .card-bottom {
      display: flex;
      justify-content: center;

      button {
        width: 30%;
      }
    }
  }
}
</style>
