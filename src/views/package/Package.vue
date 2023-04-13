<script setup lang="ts">
import $axios from "@/axios";
import { forEach } from "lodash";
import { ref, reactive, getCurrentInstance, Suspense} from "vue";

//表格数据格式
const columns = [
  {
    title: "套餐名称",
    key: "name",
  },
  {
    title: "套餐价格",
    key: "price",
  },
  {
    title: "适用人群",
    key: "applicableGroup",
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
let res = await $axios.get("package/list");

//数据类响应式变量
const state = reactive({
  info: {
    name:"",
    modal:false,
    data:res.data,
    checkgroup:[]
  }
});

async function setcheck(cname:string) {
   state.info.name=cname;
   state.info.checkgroup = (await $axios.post("package/categories",state.info)).data;
   state.info.modal = true;
}
</script>

<template>
    <!-- Package主表格 -->
    <Table
      class="table"
      :columns="columns"
      :data="state.info.data"
      >
      <template #operation="{ row, index }">
          <div class="operation">    
            <Button type="info" @click="setcheck(row.name)">查看详情</Button>
            <!-- modal: 查看套餐所含检查项目 -->
            <Modal
                v-model="state.info.modal"
                title="详情"
                customClass="customWidth"
                width="60%"
                @on-ok="state.info.modal = false"
                @on-cancel="state.info.modal = false">
                <b>{{state.info.name}}套餐所含检查项目</b><br>
                  <CheckboxGroup v-model="state.info.checkgroup">
                   <Grid center square> 
                    <GridItem>
                      <Checkbox label="一般检查" border onclick="return false;"></Checkbox><br>
                      <Checkbox label="内科检查" border onclick="return false;"></Checkbox><br>
                      <Checkbox label="外科检查" border onclick="return false;"></Checkbox><br>
                      <Checkbox label="心电图" border onclick="return false;"></Checkbox><br>
                      <Checkbox label="耳鼻喉检查" border onclick="return false;"></Checkbox><br>
                      <Checkbox label="肝胆脾胰彩超" border onclick="return false;"></Checkbox><br>
                      <Checkbox label="眼科检查" border onclick="return false;"></Checkbox><br>
                    </GridItem>
                    <GridItem>
                      <Checkbox label="甲状腺超声" border onclick="return false;"></Checkbox><br>
                      <Checkbox label="血常规" border onclick="return false;"></Checkbox><br>
                      <Checkbox label="尿常规" border onclick="return false;"></Checkbox><br>
                      <Checkbox label="肾功能" border onclick="return false;"></Checkbox><br>
                      <Checkbox label="糖化血红蛋白" border onclick="return false;"></Checkbox><br>
                      <Checkbox label="空腹血糖" border onclick="return false;"></Checkbox><br>
                      <Checkbox label="肿瘤12项" border onclick="return false;"></Checkbox><br>
                    </GridItem>
                   </Grid>
                  </CheckboxGroup>
            </Modal>
          </div>
      </template>
    </Table>
  </template>

<style lang="scss" scoped>
</style>