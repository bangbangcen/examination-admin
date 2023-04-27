<script setup lang="ts">
import $axios from "@/axios";
import { forEach } from "lodash";
import type { Row } from "view-ui-plus";
import { ref, reactive, getCurrentInstance, Suspense} from "vue";
const { proxy } = getCurrentInstance() as any;

//响应式变量state，包括回传数据组datax、按钮控件buttonx、按钮文字textx
let department_id=14;
const state = reactive({
  info: {
    modal:false,
    data9:[{item_id:0,value_type:0,value:Math.random(),text:"请输入"}],//&*&,按category编号
    data11:[{item_id:0,value_type:0,value:Math.random(),text:"请输入"}],//&*&,按category编号
    data12:[{item_id:0,value_type:0,value:Math.random(),text:"请输入"}],//&*&,按category编号
    data13:[{item_id:0,value_type:0,value:Math.random(),text:"请输入"}],//&*&,按category编号
    data14:[{item_id:0,value_type:0,value:Math.random(),text:"请输入"}],//&*&,按category编号
    button9:true,button11:true,button12:true,button13:true,button14:true,
    text9:"无该项目",text11:"无该项目",text12:"无该项目",text13:"无该项目",text14:"无该项目",
    div9:"",div11:"",div12:"",div13:"",div14:"",
  }
});


//获取该科室就诊人相关信息、控制按钮
let examinee_info = (await $axios.post("queue/examinee_info",{department_id:department_id})).data[0]//&*&
for(var i=0;i<examinee_info.category_id.length;++i){
  if(examinee_info.category_id[i].category_id==9){state.info.button9=false;state.info.text9="提交";}
  if(examinee_info.category_id[i].category_id==11){state.info.button11=false;state.info.text11="提交";}
  if(examinee_info.category_id[i].category_id==12){state.info.button12=false;state.info.text12="提交";}
  if(examinee_info.category_id[i].category_id==13){state.info.button13=false;state.info.text13="提交";}
  if(examinee_info.category_id[i].category_id==14){state.info.button14=false;state.info.text14="提交";}
}


//获取项目x检查指标、随机填数
let item_9 = (await $axios.post("item/list",{category_id:9})).data; //&*&
for (var i = 1; i < item_9.length; i++) { //&*&
    if(item_9[i].value_type==0){//&*&
      state.info.data9.push({item_id:i,value_type:0,value:Math.random(),text:""});//&*&
    }
    else{
      state.info.data9.push({item_id:i,value_type:1,value:0,text:"请输入"});//&*&
    }
 }
let item_11 = (await $axios.post("item/list",{category_id:11})).data; //&*&
for (var i = 1; i < item_11.length; i++) { //&*&
    if(item_11[i].value_type==0){//&*&
      state.info.data11.push({item_id:i,value_type:0,value:Math.random(),text:""});//&*&
    }
    else{
      state.info.data11.push({item_id:i,value_type:1,value:0,text:"请输入"});//&*&
    }
 }
let item_12 = (await $axios.post("item/list",{category_id:12})).data; //&*&
for (var i = 1; i < item_12.length; i++) { //&*&
    if(item_12[i].value_type==0){//&*&
      state.info.data12.push({item_id:i,value_type:0,value:Math.random(),text:""});//&*&
    }
    else{
      state.info.data12.push({item_id:i,value_type:1,value:0,text:"请输入"});//&*&
    }
 }
let item_13 = (await $axios.post("item/list",{category_id:13})).data; //&*&
for (var i = 1; i < item_13.length; i++) { //&*&
  if(item_13[i].value_type==0){//&*&
    state.info.data13.push({item_id:i,value_type:0,value:Math.random(),text:""});//&*&
  }
  else{
    state.info.data13.push({item_id:i,value_type:1,value:0,text:"请输入"});//&*&
  }
}
let item_14 = (await $axios.post("item/list",{category_id:14})).data; //&*&
for (var i = 1; i < item_14.length; i++) { //&*&
  if(item_14[i].value_type==0){//&*&
    state.info.data14.push({item_id:i,value_type:0,value:Math.random(),text:""});//&*&
  }
  else{
    state.info.data14.push({item_id:i,value_type:1,value:0,text:"请输入"});//&*&
  }
}


//提交项目x
async function submit9(){//&*&
  if(!state.info.button9){
    let category_id=9;//&*&
    let data=state.info.data9;//&*&
    let order_id=examinee_info.order_id;
    let start_id=item_9[0].id;
    let doctor_id=localStorage.getItem('uid');
    const send={category_id:category_id,data:data,order_id:order_id,start_id:start_id,doctor_id:doctor_id};
    await $axios.post("examination_result/add",send);//assignment添加医生id、examination_result添加若干记录
    await proxy.$Message.success({ content: "提交成功" });
    state.info.button9=true;
    state.info.text9="已提交";
  }
  else{
    await proxy.$Message.error({ content: "请勿重复提交" });
  }
}
async function submit11(){//&*&
  if(!state.info.button11){
    let category_id=11;//&*&
    let data=state.info.data11;//&*&
    let order_id=examinee_info.order_id;
    let start_id=item_11[0].id;
    let doctor_id=localStorage.getItem('uid');
    const send={category_id:category_id,data:data,order_id:order_id,start_id:start_id,doctor_id:doctor_id};
    await $axios.post("examination_result/add",send);//assignment添加医生id、examination_result添加若干记录
    await proxy.$Message.success({ content: "提交成功" });
    state.info.button11=true;
    state.info.text11="已提交";
  }
  else{
    await proxy.$Message.error({ content: "请勿重复提交" });
  }
}
async function submit12(){//&*&
  if(!state.info.button12){
    let category_id=12;//&*&
    let data=state.info.data12;//&*&
    let order_id=examinee_info.order_id;
    let start_id=item_12[0].id;
    let doctor_id=localStorage.getItem('uid');
    const send={category_id:category_id,data:data,order_id:order_id,start_id:start_id,doctor_id:doctor_id};
    await $axios.post("examination_result/add",send);//assignment添加医生id、examination_result添加若干记录
    await proxy.$Message.success({ content: "提交成功" });
    state.info.button12=true;
    state.info.text12="已提交";
  }
  else{
    await proxy.$Message.error({ content: "请勿重复提交" });
  }
}
async function submit13(){//&*&
  if(!state.info.button13){
    let category_id=13;//&*&
    let data=state.info.data13;//&*&
    let order_id=examinee_info.order_id;
    let start_id=item_13[0].id;
    let doctor_id=localStorage.getItem('uid');
    const send={category_id:category_id,data:data,order_id:order_id,start_id:start_id,doctor_id:doctor_id};
    await $axios.post("examination_result/add",send);//assignment添加医生id、examination_result添加若干记录
    await proxy.$Message.success({ content: "提交成功" });
    state.info.button13=true;
    state.info.text13="已提交";
  }
  else{
    await proxy.$Message.error({ content: "请勿重复提交" });
  }
}
async function submit14(){//&*&
  if(!state.info.button14){
    let category_id=14;//&*&
    let data=state.info.data14;//&*&
    let order_id=examinee_info.order_id;
    let start_id=item_14[0].id;
    let doctor_id=localStorage.getItem('uid');
    const send={category_id:category_id,data:data,order_id:order_id,start_id:start_id,doctor_id:doctor_id};
    await $axios.post("examination_result/add",send);//assignment添加医生id、examination_result添加若干记录
    await proxy.$Message.success({ content: "提交成功" });
    state.info.button14=true;
    state.info.text14="已提交";
  }
  else{
    await proxy.$Message.error({ content: "请勿重复提交" });
  }
}

//查看所有排队人员

//有请下一位~天才上单
async function next_examinee(){//&*&
  if(state.info.button9 && state.info.button11 && state.info.button12 && state.info.button13 && state.info.button14){
    await $axios.post("queue/delete",{order_id:examinee_info.order_id,department_id:department_id});
    await proxy.$Message.success({ content: "项目已全部完成！正在加载下一位......" });
    await $axios.post("assignment/intel",{examinee_id:examinee_info.examinee_id});
    location.reload();
  }
  else{
    await proxy.$Message.error({ content: "请完成所有项目后提交" });
  }
}

</script>

<template>
  <div>
    <b style="font-size: 20px;display: inline-block;margin-left: 2%;color:blue;">当前体检人：{{ examinee_info.name }}</b>
    <Button class="button" type="warning" @click="next_examinee()" >结束当前体检</Button>
    <br><br>


    <Grid :col="2">

      <!--第一框格:血常规-->
      <GridItem>
        <Form :style="{ 'visibility' : state.info.div9  }">
          <FormItem >
              <b style="text-align: left;display: inline-block;font-size: 20px;">项目一：血常规</b>
              <Button class="button" :disabled='state.info.button9' type="primary" @click="submit9()">{{state.info.text9}}</Button>
          </FormItem>
          <!--&*&-->
          <FormItem v-for="(i, index) in item_9" class="item"> 
            <Row class="text">
              <Col span="2">{{ index+1 }}</Col>
              <Col span="8">{{ i.name }}</Col>
              <!--&*&-->
              <Col v-if="i.value_type==0" span="11"><Input v-model="state.info.data9[index].value"></Input></Col>
              <!--&*&-->
              <Col v-else span="12"><Input v-model="state.info.data9[index].text"></Input></Col>
              <Col span="3">{{ i.unit }}</Col>
            </Row>
          </FormItem>
        </Form>


        <!--第四框格:空腹血糖-->
        <Form :style="{ 'visibility' : state.info.div13  }">
          <FormItem >
              <b style="text-align: left;display: inline-block;font-size: 20px;">项目二：空腹血糖</b>
              <Button class="button" :disabled='state.info.button13' type="primary" @click="submit13()">{{state.info.text13}}</Button>
          </FormItem>
          <!--&*&-->
          <FormItem v-for="(i, index) in item_13" class="item"> 
            <Row class="text">
              <Col span="2">{{ index+1 }}</Col>
              <Col span="8">{{ i.name }}</Col>
              <!--&*&-->
              <Col v-if="i.value_type==0" span="11"><Input v-model="state.info.data13[index].value"></Input></Col>
              <!--&*&-->
              <Col v-else span="12"><Input v-model="state.info.data13[index].text"></Input></Col>
              <Col span="3">{{ i.unit }}</Col>
            </Row>
          </FormItem>
        </Form>
      </GridItem>


      <GridItem >
        <!--第三框格:糖化血红蛋白-->
        <Form :style="{ 'visibility' : state.info.div12  }">
          <FormItem >
              <b style="text-align: left;display: inline-block;font-size: 20px;">项目三：糖化血红蛋白</b>
              <Button class="button" :disabled='state.info.button12' type="primary" @click="submit12()" >{{state.info.text12}}</Button>
          </FormItem>
          <!--&*&-->
          <FormItem v-for="(i, index) in item_12" class="item"> 
            <Row class="text">
              <Col span="2">{{ index+1 }}</Col>
              <Col span="8">{{ i.name }}</Col>
              <!--&*&-->
              <Col v-if="i.value_type==0" span="11"><Input v-model="state.info.data12[index].value"></Input></Col>
              <!--&*&-->
              <Col v-else span="12"><Input v-model="state.info.data12[index].text"></Input></Col>
              <Col span="3">{{ i.unit }}</Col>
            </Row>
          </FormItem>
        </Form>


         <!--第二框格:肾功能-->
        <Form :style="{ 'visibility' : state.info.div11  }">
          <FormItem >
              <b style="text-align: left;display: inline-block;font-size: 20px;">项目四：肾功能</b>
              <Button class="button" :disabled='state.info.button11' type="primary" @click="submit11()">{{state.info.text11}}</Button>
          </FormItem>
          <!--&*&-->
          <FormItem v-for="(i, index) in item_11" class="item"> 
            <Row class="text">
              <Col span="2">{{ index+1 }}</Col>
              <Col span="8">{{ i.name }}</Col>
              <!--&*&-->
              <Col v-if="i.value_type==0" span="11"><Input v-model="state.info.data11[index].value"></Input></Col>
              <!--&*&-->
              <Col v-else span="12"><Input v-model="state.info.data11[index].text"></Input></Col>
              <Col span="3">{{ i.unit }}</Col>
            </Row>
          </FormItem>
        </Form>


        <!--第五框格:肿瘤12项-->
        <Form :style="{ 'visibility' : state.info.div14  }">
          <FormItem >
              <b style="text-align: left;display: inline-block;font-size: 20px;">项目五：肿瘤12项</b>
              <Button class="button" :disabled='state.info.button14' type="primary" @click="submit14()">{{state.info.text14}}</Button>
          </FormItem>
          <!--&*&-->
          <FormItem v-for="(i, index) in item_14" class="item"> 
            <Row class="text">
              <Col span="2">{{ index+1 }}</Col>
              <Col span="10">{{ i.name }}</Col>
              <!--&*&-->
              <Col v-if="i.value_type==0" span="9"><Input v-model="state.info.data14[index].value"></Input></Col>
              <!--&*&-->
              <Col v-else span="9"><Input v-model="state.info.data14[index].text"></Input></Col>
              <Col span="3">{{ i.unit }}</Col>
            </Row>
          </FormItem>
        </Form>
      </GridItem>
    </Grid>


  </div>
</template>

<style lang="scss" scoped>
.item {
  width: auto;
  height: 10px;
}
.text {
  font-size: 15px;
  height: 50%;
}
.button{
  font-size: 20px;
  float: right;
}
</style>