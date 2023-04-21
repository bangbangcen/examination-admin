<script setup lang="ts">
import $axios from "@/axios";
import { forEach } from "lodash";
import type { Row } from "view-ui-plus";
import { ref, reactive, getCurrentInstance, Suspense} from "vue";
const { proxy } = getCurrentInstance() as any;

//响应式变量state
const state = reactive({
  info: {
    modal:false,
    data9:[{item_id:0,value_type:0,value:Math.random(),text:"请输入"}],//&*&,按category编号
    button9:true
  }
});

//获取就诊人相关信息
let examinee_info = (await $axios.post("queue/examinee_info",{department_id:14})).data[0]//&*&

//获取检查指标、随机填数（？）
let item_9 = (await $axios.post("item/list",{category_id:9})).data; //&*&
for (var i = 1; i < item_9.length; i++) { //&*&
    if(item_9[i].value_type==0){//&*&
      state.info.data9.push({item_id:i,value_type:0,value:Math.random(),text:""});//&*&
    }
    else{
      state.info.data9.push({item_id:i,value_type:1,value:0,text:"请输入"});//&*&
    }
 }

async function submit9(){//&*&
  if(state.info.button9){
    let category_id=9;//&*&
    let data=state.info.data9;//&*&
    let order_id=examinee_info.order_id;
    let start_id=item_9[0].id;
    let doctor_id=localStorage.getItem('uid');
    const send={category_id:category_id,data:data,order_id:order_id,start_id:start_id,doctor_id:doctor_id};
    await $axios.post("examination_result/add",send);//assignment添加医生id、examination_result添加若干记录
    await proxy.$Message.success({ content: "提交成功" });
    state.info.button9=false;
  }
  else{
    await proxy.$Message.error({ content: "请勿重复提交" });
  }
}
</script>

<template>
  <div>
    <p style="text-align: center;font-size: large;">当前体检人：{{ examinee_info.name }}</p>
    <Grid>
      <!--第一框格:血常规-->
      <GridItem>
        <Form>
          <FormItem >
              <p style="text-align: left;display: inline-block;font-size: 20px;">项目一：血常规</p>
              <Button type="primary" @click="submit9()" style="float: right;">提交</Button>
          </FormItem>
          <!--&*&-->
          <FormItem v-for="(i, index) in item_9" class="item"> 
            <Row class="text">
              <Col span="2">{{ index+1 }}</Col>
              <Col span="9">{{ i.name }}</Col>
              <!--&*&-->
              <Col v-if="i.value_type==0" span="9"><Input v-model="state.info.data9[index].value"></Input></Col>
              <!--&*&-->
              <Col v-else span="9"><Input v-model="state.info.data9[index].text"></Input></Col>
              <Col span="4">{{ i.unit }}</Col>
            </Row>
          </FormItem>
        </Form>
      </GridItem>

      <!--第二框格:-->
      <GridItem></GridItem>
    </Grid>
  </div>
</template>

<style lang="scss" scoped>
.item {
  width: auto;
  height: 10px;
}
.text {
  font-size: 8px;
  height: 50%;
}
</style>