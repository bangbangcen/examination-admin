<script setup lang="ts">
import $axios from "@/axios";
import { forEach } from "lodash";
import { ref, reactive, getCurrentInstance, Suspense} from "vue";

const List1 =[
{
    value: '呼吸内科',
    label: '呼吸内科'
},
{
    value: '消化内科',
    label: '消化内科'
},
{
    value: '心血管内科',
    label: '心血管内科'
},
{
    value: '神经内科',
    label: '神经内科'
},
{
    value: '内分泌科',
    label: '内分泌科'
},
{
    value: '肿瘤科',
    label: '肿瘤科'
},
{
    value: '肾脏内科',
    label: '肾脏内科'
},
{
    value: '血液内科',
    label: '血液内科'
},
];
const List2 =[
{
    value: '口腔科',
    label: '口腔科'
},
{
    value: '眼科',
    label: '眼科'
},
{
    value: '耳鼻喉科',
    label: '耳鼻喉科'
},
{
    value: '妇科',
    label: '妇科'
},
{
    value: '普外科',
    label: '普外科'
},
{
    value: '骨科',
    label: '骨科'
},
{
    value: '泌尿外科',
    label: '泌尿外科'
},
{
    value: '乳腺外科',
    label: '乳腺外科'
},
];
const List3 =[
{
    value: '放射科',
    label: '放射科'
},
{
    value: '超声科',
    label: '超声科'
},
];
const List4 =[
{
    value: '体检科',
    label: '体检科'
},
];
const columns = [
  {
    title: "医生姓名",
    key: "doctor_name",
  },
  {
    title: "所属科室",
    key: "department_name",
  },
  {
    title: "当前状态",
    key: "is_busy",
    render: (h:any, params:any) => {
            return h('div', [
              h('span', {
                style: {
                  color: params.row.is_busy ? 'red':'blue'
                }
              }, 
              params.row.is_busy ? '工作中':'休息中'),
            ])
          }
  },
];
//响应式变量page
const page = reactive({
  params: {
    dname:"",
  }
});

//初次获得数据
let res = await $axios.post("department_doctor/list",page.params);

//响应式变量state
const state = reactive({
  info: {
    modal1:false,
    data:res.data,
  }
});

//翻页
async function change_data(){
  res = await $axios.post("department_doctor/list",page.params);
  state.info.data=res.data;
  console.log(Number(res.data[0].is_busy));
}

async function test(){
  await $axios.post("assignment/intel",{examinee_id:2});
}
</script>

<template>
  <Button type="primary" @click="test()">导检测试</Button>
  <Select v-model="page.params.dname" style="width:850px" @on-change="change_data()" placeholder="请选择科室">
        <OptionGroup label="内科学">
            <Option v-for="item in List1" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </OptionGroup>
        <OptionGroup label="外科学">
            <Option v-for="item in List2" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </OptionGroup>
        <OptionGroup label="医学影像学">
            <Option v-for="item in List3" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </OptionGroup>
        <OptionGroup label="其它科室">
            <Option v-for="item in List4" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </OptionGroup>
    </Select>
  <!-- <Space wrap size="large" >
        <RadioGroup v-model="page.params.dname" type="button" size="large" @on-change="change_data()">
            <Radio label="内科学"></Radio>
            <Radio label="外科学"></Radio>
            <Radio label="医学影像学"></Radio>
            <Radio label="其它科室"></Radio>
        </RadioGroup>
    </Space> -->
  <!-- Department主表格 -->
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
