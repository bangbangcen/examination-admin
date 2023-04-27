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
        case 2:return '暂停中';break;
        case 3:return '已完成';break;
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
          label: '暂停中',
          value: '2'
      },
      {
          label: '已完成',
          value: '3'
      }
    ],
    filterMethod (value:any, row:any) {return row.status==value;}
  },
  {
    title: "修改状态",
    slot: "operation1",
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
    modal:false,
    modal2:false,
    disabled:[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    statusDisabled:true,
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
    order_status:-1,
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

//打开模态框1
async function openModal(id:string,status:number) {
  if(status==0){
    alert("该用户未开始体检");
  }
  else{
    state.info.order_id=id;
    page.params.disabled=[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
    const res=(await $axios.post("examination_order/assignment",state.info)).data;
    for(var i=0;i<res.length;++i){
      page.params.disabled[res[i].id]=true;
    }
    state.info.name="";
    page.params.modal = true;
  }
}

//打开模态框2
async function openModal2(id:string,status:number) {
  if(status==0){page.params.statusDisabled=false;}
  state.info.order_id=id;
  state.info.order_status=-1;
  page.params.modal2 = true;
}

//按订单号添加子项目名
async function addAssignment() {
  if(state.info.name==""){alert("选项为空");}
  else{
    await $axios.post("queue/delete",{order_id:state.info.order_id,department_id:-1});
    await $axios.post("examination_order/addAssignment",state.info);
    await proxy.$Message.success({ content: "增检成功" });
  }
}

//改变体检订单状态
async function changeStatus(examinee_id:number) {
  if(state.info.order_status==-1){alert("选项为空");}
  else{
    await $axios.post("examination_order/changeStatus",state.info);
    await proxy.$Message.success({ content: "更改成功" });
    res = await $axios.post("examination_order/list",page.params);
    state.info.data=res.data;
    if(state.info.order_status==1){
      await $axios.post("examination_order/newAssignment",state.info);
      await $axios.post("assignment/intel",{examinee_id:examinee_id});
    }
  }
}
</script>

<template>
  <!-- <Space direction="vertical" size="large" type="flex">
        <Input search enter-button v-model="page.params.dname" @on-change="change_data()" placeholder="输入体检人姓名或联系电话以搜索" />
  </Space> -->

  <!-- 搜索框 -->
  <Input
    placeholder="请输入任何信息以搜索"
    class="search"
    @on-blur="change_data()"
    v-model="page.params.dname"
  >
    <template #suffix>
      <Icon type="ios-search" />
    </template>
  </Input>

  <!-- Order主表格 -->
  <Table
    class="table"
    :columns="columns"
    :data="state.info.data"
    >

    <!-- 修改状态按钮 -->
    <template #operation1="{ row, index }">
          <div class="operation1"> 
            <Button type="info" @click="openModal2(row.id,row.status)">修改状态</Button>
            <!-- modal2:  -->
            <Modal
                v-model="page.params.modal2"
                title="修改状态"
                @on-ok="changeStatus(row.examinee_id)"
                @on-cancel="page.params.modal2 = false">
                <RadioGroup v-model="state.info.order_status" vertical>
                    <Radio label="1" :disabled='page.params.statusDisabled'>体检中</Radio>
                    <Radio label="2" >暂停中</Radio>
                    <Radio label="3" >已完成</Radio>
                </RadioGroup>
            </Modal>
          </div>
    </template>

    <!-- 增加检查按钮 -->
    <template #operation="{ row, index }">
          <div class="operation">    
            <!-- modal1:  -->
            <Button type="info" @click="openModal(row.id,row.status)">增加检查</Button>
            <Modal
                v-model="page.params.modal"
                title="增加检查"
                @on-ok="addAssignment()"
                @on-cancel="page.params.modal = false">
                <b>选择需要增加的检查项目</b><br>
                <RadioGroup v-model="state.info.name" vertical>
                    <Radio label="一般检查" :disabled='page.params.disabled[1]'>一般检查</Radio>
                    <Radio label="内科检查" :disabled='page.params.disabled[2]'>内科检查</Radio>
                    <Radio label="外科检查" :disabled='page.params.disabled[3]'>外科检查</Radio>
                    <Radio label="心电图" :disabled='page.params.disabled[4]'>心电图</Radio>
                    <Radio label="耳鼻喉检查" :disabled='page.params.disabled[5]'>耳鼻喉检查</Radio>
                    <Radio label="肝胆脾胰彩超" :disabled='page.params.disabled[6]'>肝胆脾胰彩超</Radio>
                    <Radio label="眼科检查" :disabled='page.params.disabled[7]'>眼科检查</Radio>
                    <Radio label="甲状腺超声" :disabled='page.params.disabled[8]'>甲状腺超声</Radio>
                    <Radio label="血常规" :disabled='page.params.disabled[9]'>血常规</Radio>
                    <Radio label="尿常规" :disabled='page.params.disabled[10]'>尿常规</Radio>
                    <Radio label="肾功能" :disabled='page.params.disabled[11]'>肾功能</Radio>
                    <Radio label="糖化血红蛋白" :disabled='page.params.disabled[12]'>糖化血红蛋白</Radio>
                    <Radio label="空腹血糖" :disabled='page.params.disabled[13]'>空腹血糖</Radio>
                    <Radio label="肿瘤12项" :disabled='page.params.disabled[14]'>肿瘤12项</Radio>
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
.search {
  width: auto;
  margin: 20px 20px 0 20px;
}
</style>
