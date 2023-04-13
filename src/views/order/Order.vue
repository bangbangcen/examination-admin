<script setup lang="ts">
import $axios from "@/axios";
import { forEach } from "lodash";
import { ref, reactive, getCurrentInstance, Suspense} from "vue";
const { proxy } = getCurrentInstance() as any;

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
    filters: [
      {
          label: '上海第一体检中心',
          value: '上海第一体检中心'
      }
    ],
    filterMethod (value:any, row:any) {return row.center_name==value;},
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
  {
    title: "增加检查",
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
let res = await $axios.post("examination_order/list",page.params);

//数据类响应式变量
const state = reactive({
  info: {
    data:res.data,
    order_id:"",
    name:"",
    modal:false,
    disabled:[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false]
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

async function openModal(id:string) {
  state.info.order_id=id;
  state.info.disabled=[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
  const res=(await $axios.post("examination_order/assignment",state.info)).data;
  for(var i=0;i<res.length;++i){
    state.info.disabled[res[i].id]=true;
  }
  state.info.name="";
  state.info.modal = true;
}

async function addCategory() {
  if(state.info.name==""){alert("选项为空");}
  else{
    await $axios.post("examination_order/addCategory",state.info);
    await proxy.$Message.success({ content: "增检成功" });
  }
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
    <template #operation="{ row, index }">
          <div class="operation">    
            <!-- modal:  -->
            <Button type="info" @click="openModal(row.id)">增加检查</Button>
            <Modal
                v-model="state.info.modal"
                title="增加检查"
                @on-ok="addCategory()"
                @on-cancel="state.info.modal = false">
                <b>选择需要增加的检查项目</b><br>
                <RadioGroup v-model="state.info.name" vertical>
                    <Radio label="一般检查" :disabled='state.info.disabled[1]'>一般检查</Radio>
                    <Radio label="内科检查" :disabled='state.info.disabled[2]'>内科检查</Radio>
                    <Radio label="外科检查" :disabled='state.info.disabled[3]'>外科检查</Radio>
                    <Radio label="心电图" :disabled='state.info.disabled[4]'>心电图</Radio>
                    <Radio label="耳鼻喉检查" :disabled='state.info.disabled[5]'>耳鼻喉检查</Radio>
                    <Radio label="肝胆脾胰彩超" :disabled='state.info.disabled[6]'>肝胆脾胰彩超</Radio>
                    <Radio label="眼科检查" :disabled='state.info.disabled[7]'>眼科检查</Radio>
                    <Radio label="甲状腺超声" :disabled='state.info.disabled[8]'>甲状腺超声</Radio>
                    <Radio label="血常规" :disabled='state.info.disabled[9]'>血常规</Radio>
                    <Radio label="尿常规" :disabled='state.info.disabled[10]'>尿常规</Radio>
                    <Radio label="肾功能" :disabled='state.info.disabled[11]'>肾功能</Radio>
                    <Radio label="糖化血红蛋白" :disabled='state.info.disabled[12]'>糖化血红蛋白</Radio>
                    <Radio label="空腹血糖" :disabled='state.info.disabled[13]'>空腹血糖</Radio>
                    <Radio label="肿瘤12项" :disabled='state.info.disabled[14]'>肿瘤12项</Radio>
                </RadioGroup>
            </Modal>
          </div>
      </template>
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
