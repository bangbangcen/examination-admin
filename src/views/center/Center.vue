<script setup lang="ts">
import $axios from "@/axios";
import { forEach } from "lodash";
import { ref, reactive, getCurrentInstance, Suspense} from "vue";
//import { Permission } from "@/model";
//const { proxy } = getCurrentInstance() as any;

//表格格式
const columns = [
  {
    title: "体检机构名称",
    key: "n",
  },
  {
    title: "区县",
    key: "name",
    // filters:[
    //   {
    //     label: '黄浦区',
    //     value: '黄浦区'
    //   },
    //   {
    //     label: '徐汇区',
    //     value: '徐汇区'
    //   },
    //   {
    //     label: '长宁区',
    //     value: '长宁区'
    //   },
    //   {
    //     label: '静安区',
    //     value: '静安区'
    //   },
    //   {
    //     label: '普陀区',
    //     value: '普陀区'
    //   },
    //   {
    //     label: '虹口区',
    //     value: '虹口区'
    //   },
    //   {
    //     label: '杨浦区',
    //     value: '杨浦区'
    //   },
    //   {
    //     label: '闵行区',
    //     value: '闵行区'
    //   },
    //   {
    //     label: '宝山区',
    //     value: '宝山区'
    //   },
    //   {
    //     label: '嘉定区',
    //     value: '嘉定区'
    //   },
    //   {
    //     label: '浦东新区',
    //     value: '浦东新区'
    //   },
    //   {
    //     label: '金山区',
    //     value: '金山区'
    //   },
    //   {
    //     label: '松江区',
    //     value: '松江区'
    //   },
    //   {
    //     label: '青浦区',
    //     value: '青浦区'
    //   },
    //   {
    //     label: '奉贤区',
    //     value: '奉贤区'
    //   },
    //   {
    //     label: '崇明区',
    //     value: '崇明区'
    //   },
    // ],
    // //筛选器
    // filterMethod (value: any, row: any) {
    // return row.districtId.indexOf(value) > -1;
    // }
  },
  {
    title: "地址",
    key: "address",
  },
  {
    title: "最近的交通站点",
    key: "nearby",
  },
  {
    title: "联系电话",
    key: "telephone",
  },
  {
    title: "公告",
    key: "announcement",
  },
  {
    title: "经度",
    key: "latitude",
  },
  {
    title: "纬度",
    key: "longitude",
  },
  {
    title: "上午体检人数限制",
    key: "morning_limit",
  },
  {
    title: "下午日渐人数限制",
    key: "afternoon_limit",
  },
  {
    title: "操作",
    slot: "operation",
  },
];

//响应式变量page
const page = reactive({
  params: {
    curPage:1,
    pageSize:20,
  }
});

//初次获得数据
let res = await $axios.post("examination_center/list",page.params);
get_pagesize();

//响应式变量state
const state = reactive({
  info: {
    name:'',
    modal1:false,
    data:res.data,
  }
});

//从数据库删除指定行数据
async function del(cname:string) {
  state.info.modal1 = true;
  state.info.name=cname;
  await $axios.post("examination_center/del",state.info);
}

//翻页
async function change_data(event:any){
  page.params.curPage=event;
  res = await $axios.post("examination_center/list",page.params);
  state.info.data = res.data;
  get_pagesize();
}

async function get_pagesize(){
  res = await $axios.post("examination_center/count");
  page.params.pageSize=res.data*2;
}

</script>

<template>
  <div>
    <!-- <Input search enter-button="Search" placeholder="Enter something..." /> -->
    <!-- Center主表格 -->
    <Table
      class="table"
      :columns="columns"
      :data="state.info.data"
    >
      <template #operation="{ row, index }">
          <div class="operation">
            <!-- <Button type="error"  @click="del(row.n)">
              <Icon type="md-trash" size="18" />
            </Button> -->
    
            <!-- modal1: 确认从数据库删除指定行数据 -->
            <Button type="error" @click="state.info.modal1 = true">删除</Button>
            <Modal
                v-model="state.info.modal1"
                title="啊？真删？！"
                @on-ok="del(row.n)"
                @on-cancel="state.info.modal1 = false">
            </Modal>
          </div>
      </template>
    </Table>
    <Page :total="page.params.pageSize"  @on-change='change_data($event)'/>
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
