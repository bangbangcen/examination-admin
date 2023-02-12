<script setup lang="ts">
import $axios from "@/axios";
import { forEach } from "lodash";
import { ref, reactive, getCurrentInstance, Suspense} from "vue";

//sql时间格式化
function timeFormatter(value:any) {
  var t = new Date(value.split("T")[0]);
  return t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + (t.getDate()+1);
}

//表格数据格式
const columns = [
  {
    title: "体检人",
    key: "name",
  },
  {
    title: "联系电话",
    key: "phone",
  },
  {
    title: "套餐名称",
    key: "package_name",
  },
  {
    title: "体检中心",
    key: "center_name",
  },
  
  {
    title: "预约日期",
    key: "examine_date",
    render: (h:any, params:any) => {
      return  timeFormatter(params.row.examine_date);
    }
  },
  {
    title: "公司名称",
    key: "type",
    render: (h:any, params:any) => {
      switch (params.row.type){
        case 0:
          return params.row.company_name;
          break;
        case 1:
          return '个检';
          break;
      }
    },
    filters: [
      {
          label: '团检',
          value: '0'
      },
      {
          label: '个检',
          value: '1'
      }
    ],
    filterMethod (value:any, row:any) {return row.type==value;},
    
  },
  {
    title: "当前状态",
    key: "status",
    render: (h:any, params:any) => {
      switch (params.row.status){
        case 0:return '未体检';break;
        case 1:return '体检中';break;
        case 2:return '已完成';break;
      }
    },
    filters: [
      {
          label: '未体检',
          value: '0'
      },
      {
          label: '体检中',
          value: '1'
      },
      {
          label: '已完成',
          value: '2'
      }
    ],
    filterMethod (value:any, row:any) {return row.status==value;}
  },
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
let res = await $axios.post("examination_order/list",page.params);

//数据类响应式变量
const state = reactive({
  info: {
    data:res.data,
  }
});

//防抖计时器
var timer:any=null;

//搜索数据库，更新data
async function change_data(){
  clearTimeout(timer);
  timer=setTimeout( async function(){
    res = await $axios.post("examination_order/list",page.params);
    state.info.data=res.data;
  },300)
}
</script>

<template>
  <!-- 搜索框 -->
  <Space direction="vertical" size="large" type="flex">
        <Input search enter-button v-model="page.params.dname" @on-change="change_data()" placeholder="输入体检人姓名或联系电话以搜索" />
  </Space>
  <!-- Order主表格 -->
  <Table
    class="table"
    :columns="columns"
    :data="state.info.data"
    >
  </Table>
</template>

<style lang="scss" scoped>
.table-top {
  margin-bottom: 16px;

  button {
    margin-right: 20px;
  }
}
</style>
