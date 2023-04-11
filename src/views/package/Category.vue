<script setup lang="ts">
import $axios from "@/axios";
import { forEach } from "lodash";
import { ref, reactive, getCurrentInstance, Suspense} from "vue";


//表格数据格式
const columns = [
  {
    title: "项目分类名称",
    key: "name",
  },
  {
    title: "平均检查时间",
    key: "averageDuration",
  },
  {
    title: "价格",
    key: "price",
  },
  {
    title: "查看详情",
    slot: "operation",
  }
];

//页面参数类响应式变量
const page = reactive({
  params: {
    dname:"",
    curPage:1,
    pageSize:20,
  }
});

//首次设置数据
let res = await $axios.get("category/list");

//数据类响应式变量
const state = reactive({
  info: {
    name:"",
    modal:false,
    data:res.data,
    item:[{name:"",average_duration:""}]
  }
});

async function setItem(cname:string) {
    state.info.modal = true;
    state.info.name=cname;
    state.info.item = (await $axios.post("category/item",state.info)).data;
}
</script>

<template>
  <!-- Category主表格 -->
  <Table
    class="table"
    :columns="columns"
    :data="state.info.data"
    >
    <template #operation="{ row, index }">
          <div class="operation">    
            <!-- modal:  -->
            <Button type="info" @click="setItem(row.name)">查看详情</Button>
            <Modal
                v-model="state.info.modal"
                title="详情"
                @on-ok="state.info.modal = false"
                @on-cancel="state.info.modal = false">
                <b>{{state.info.name}}所含体检指标</b><br>
                <Row>
                    <Col span="8" class="first">编号</Col>
                    <Col span="8" class="first">体检指标名</Col>
                </Row>
                <Row v-for="(i, index) in state.info.item">
                    <Col span="8" class="first">{{ index }}</Col>
                    <Col span="8" class="first">{{ i.name }}</Col>
                </Row>
            </Modal>
          </div>
      </template>
  </Table>
</template>

<style lang="scss" scoped>
.first {
  font-size: 15px;
  padding-left: 5px;
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
</style>
