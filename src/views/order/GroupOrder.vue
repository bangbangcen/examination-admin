<script setup lang="ts">
import $axios from "@/axios";
import { reactive, getCurrentInstance} from "vue";
import JsBarcode from 'jsbarcode';
const { proxy } = getCurrentInstance() as any;



const state = reactive({
  info: {
    examinee_id:2,
    modal:false,
    list:[{name:"",queue_length:-1,number:-1}],
    modal2:false,
    status:-1,//订单状态
    date:false,//是否是当天
    department_name:-1,//科室名
    department_id:-1,
    serial_number:-1,//排队号
    order_id:-1,//订单号
    time:"",//排队时间
    breakfast:-1,//是否可以吃饭
    breakfast_status:"",//吃饭文学，对应breakfast：0、1、2
    button:-1,//按钮编号
    button_status:"",//按钮文学
    pausing:false,//是否暂停

    name:"",//选择增检的项目名
  }
});
const page = reactive({
    params: {
      disabled:[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    }
  });



//初始化
let res = (await $axios.post("examination_order/examinee_status",{examinee_id:state.info.examinee_id})).data;
state.info.status = res.status
state.info.date = res.date;
if(res.status!=4){
  if(res.status!=0){
    state.info.order_id=res.order_id;
    state.info.department_name=res.department_name;
    state.info.department_id=res.department_id;
    state.info.serial_number=res.serial_number;
    state.info.time=res.time;
    state.info.breakfast=res.breakfast;
    if(state.info.breakfast==0){state.info.breakfast_status="不可用餐";}
    else if(state.info.breakfast==1){state.info.breakfast_status="未用餐";}
    else if(state.info.breakfast==2){state.info.breakfast_status="已用餐";}

    const result=(await $axios.post("examination_order/assignment",{order_id:res.order_id})).data;
    for(var i=0;i<result.length;++i){
      page.params.disabled[result[i].id]=true;  
    }
  }
}

//按订单号添加子项目名
async function addAssignment() {
  if(state.info.name==""){alert("选项为空");}
  else{
    //await $axios.post("queue/delete",{order_id:state.info.order_id,department_id:-1});
    await $axios.post("examination_order/addAssignment",state.info);
    await proxy.$Message.success({ content: "增检成功！钱我帮你付了哈！" });
    buttonOnClick(5);
  }
}

async function openModal2(){
  state.info.list=(await $axios.post("queue/list",state.info)).data;
  state.info.modal2=true;
}

async function buttonOnClick(bid:number){
  state.info.button=bid;
  if(state.info.button==1){state.info.button_status="用餐请求";}
  else if(state.info.button==2){state.info.button_status="暂停请求";}
  else if(state.info.button==3){state.info.button_status="增检请求";}
  else if(state.info.button==4){state.info.button_status="终止请求";}
  else if(state.info.button==5){state.info.button_status="返回体检";}
  state.info.modal=true;
}

async function onConfirm(){
  state.info.modal=false;
  if(state.info.button==1){//用餐请求
    if(state.info.breakfast==1){
      await $axios.post("examination_order/changeBreakfast",{examinee_id:state.info.examinee_id,breakfast:2});
      location.reload();
    }
    else if(state.info.breakfast==0){alert("现在还不能吃饭哦！");}
    else if(state.info.breakfast==2){alert("再吃一顿不会撑么？");}
  }
  else if(state.info.button==2){//暂停请求
    await $axios.post("examination_order/changeStatus2",{examinee_id:state.info.examinee_id,status:2});
    await $axios.post("queue/delete",{order_id:state.info.order_id,department_id:state.info.department_id});
    location.reload();
  }
  else if(state.info.button==3){//增检请求
    await $axios.post("examination_order/changeStatus2",{examinee_id:state.info.examinee_id,status:6});
    await $axios.post("queue/delete",{order_id:state.info.order_id,department_id:state.info.department_id});
    await location.reload();
  }
  else if(state.info.button==4){//终止请求
    alert("请前往前台，与工作人员沟通");
  }
  else if(state.info.button==5){//返回体检
    await $axios.post("assignment/intel",{examinee_id:state.info.examinee_id});
    await $axios.post("examination_order/changeStatus2",{examinee_id:state.info.examinee_id,status:1});
    location.reload();
  }
  else{location.reload();}//???
}

</script>

<template >
  <!--暂停情况-->
  <div v-if="state.info.status==2">
    <Row>
      <Col span="24" class="span">
        <Icon type="md-pause" class="icon"/>
        <h1 class="queue" style="display: inline-block;">项目已暂停</h1>
      </Col>
      <Col span="24" class="span"><Button type="info" @click="buttonOnClick(5);" class="button">回到体检</Button></Col>
    </Row>
  </div>

  <!--吃早饭情况-->
  <div v-else-if="state.info.status==3">
    <Row>
      <Col span="24" class="span">
        <Icon type="md-restaurant" class="icon"/>
        <h1 class="queue" style="display: inline-block;">请享用早餐~</h1>
      </Col>
      <Col span="24" class="span"><Button type="info" @click="buttonOnClick(5);" class="button">回到体检</Button></Col>
    </Row>
  </div>

  <!--增加检查-->
    <div v-else-if="state.info.status==6">
    <Row>
      <RadioGroup v-model="state.info.name" vertical >
          <Radio label="一般检查" :disabled='page.params.disabled[1]' style="font-size:20px">一般检查</Radio>
          <Radio label="内科检查" :disabled='page.params.disabled[2]' style="font-size:20px">内科检查</Radio>
          <Radio label="外科检查" :disabled='page.params.disabled[3]' style="font-size:20px">外科检查</Radio>
          <Radio label="心电图" :disabled='page.params.disabled[4]' style="font-size:20px">心电图</Radio>
          <Radio label="耳鼻喉检查" :disabled='page.params.disabled[5]' style="font-size:20px">耳鼻喉检查</Radio>
          <Radio label="肝胆脾胰彩超" :disabled='page.params.disabled[6]' style="font-size:20px">肝胆脾胰彩超</Radio>
          <Radio label="眼科检查" :disabled='page.params.disabled[7]' style="font-size:20px">眼科检查</Radio>
          <Radio label="甲状腺超声" :disabled='page.params.disabled[8]' style="font-size:20px">甲状腺超声</Radio>
          <Radio label="血常规" :disabled='page.params.disabled[9]' style="font-size:20px">血常规</Radio>
          <Radio label="尿常规" :disabled='page.params.disabled[10]' style="font-size:20px">尿常规</Radio>
          <Radio label="肾功能" :disabled='page.params.disabled[11]' style="font-size:20px">肾功能</Radio>
          <Radio label="糖化血红蛋白" :disabled='page.params.disabled[12]' style="font-size:20px">糖化血红蛋白</Radio>
          <Radio label="空腹血糖" :disabled='page.params.disabled[13]' style="font-size:20px">空腹血糖</Radio>
          <Radio label="肿瘤12项" :disabled='page.params.disabled[14]' style="font-size:20px">肿瘤12项</Radio>
      </RadioGroup>
    </Row>
    <Row>
      <Col span="12"><Button type="info" @click="addAssignment()" class="button">增加检查</Button></Col>
      <Col span="12"><Button type="info" @click="buttonOnClick(5);" class="button">回到体检</Button></Col>
    </Row>
  </div>

  <!--其它情况-->
  <div v-else>

    <!--0/4情况-->
    <span v-if="!state.info.date">
      <Row>
          <Col span="24" class="span">
            <h1 class="queue">当前不在该用户预约体检时间内！</h1>
            <h1 class="queue">请仔细查看预约时间候检</h1>
          </Col>
      </Row>
    </span>
    <span v-else-if="state.info.status==0 && state.info.date">
      <Row>
          <Col span="24" class="span">
            <h1 class="queue">欢迎进入体检系统！</h1>
            <h1 class="queue">请至体检中心前台进行签到</h1>
          </Col>
          <Col span="24" class="span">
            <Icon type="md-barcode" class="icon" @click="JsBarcode('#barcode', state.info.examinee_id.toString());"/>
            <div @click="JsBarcode('#barcode', state.info.examinee_id.toString());" class="text" style="display: inline-block;">点此显示二维码</div>
          </Col>
          <Col span="24" class="span">
            <img id="barcode"/>
          </Col>
      </Row>
    </span>
    <span v-else-if="state.info.status==4 && state.info.date">
      <h1 class="queue">体检已结束，祝您生活愉快</h1>
    </span>

    <!--页面主体（正常导检）-->
    <span v-else-if="state.info.date">
      <Grid :col="1">
        <GridItem>
          <Row>
            <Col span="12" class="span">
              <Icon type="md-home" style="font-size: 20px;"/>
              <p class="text" style="display: inline-block;">当前排队科室:</p>
            </Col>
            <Col span="12" class="queue">{{ state.info.department_name }}</Col>
            <Col span="12" class="span">
              <Icon type="md-megaphone" style="font-size: 20px;"/>
              <p class="text" style="display: inline-block;">您的排队叫号:</p>
            </Col>
            <Col span="12" @click="openModal2()"  class="span">
              <p class="queue" style="display: inline-block;">{{ state.info.serial_number }}</p>
              <Icon type="md-help-circle" style="font-size: 20px;"/>
            </Col>
            <Col span="12" class="span">
              <Icon type="md-clock" style="font-size: 20px;"/>
              <p class="text" style="display: inline-block;">预估叫号时间:</p>
            </Col>
            <Col span="12" class="queue">{{ state.info.time }}</Col>
            <Col span="24" style="text-align: center;">*****预估时间和实际有所出入，请耐心等待~*****</Col>
          </Row>
        </GridItem>
        <GridItem>
          <span v-if="state.info.status==1" class="info" >
            <Row>
              <Col span="1"><Icon type="md-alert" style="font-size: 20px;"/></Col>
              <Col span="6">体检状态:</Col>
              <Col span="5" >体检中</Col>
              <Col span="6">用餐状态:</Col>
              <Col span="5">{{ state.info.breakfast_status }}</Col>
            </Row>
          </span>
          <span v-else-if="state.info.status==2" class="info">
            <Row>
              <Col span="6" >体检状态：</Col>
              <Col span="6" >暂停中</Col>
              <Col span="6">用餐状态：</Col>
              <Col span="6">{{ state.info.breakfast_status }}</Col>
            </Row>
          </span>
          <span v-else-if="state.info.status==3" class="info">
            <Row>
              <Col span="12" >体检状态：</Col>
              <Col span="12" >用餐中</Col>
            </Row>
            <Row>
              <Col span="12">用餐状态：</Col>
              <Col span="12">{{ state.info.breakfast_status }}</Col>
            </Row>
          </span>
        </GridItem>
        <GridItem>
          <Row class="info">
            <Col span="12"><Button type="info"  @click="buttonOnClick(1)" class="button">我想用餐</Button></Col>
            <Col span="12"><Button type="info" @click="buttonOnClick(2)" class="button">我想暂停</Button></Col>
          </Row><br>
          <Row class="info">
            <Col span="12"><Button type="info" @click="buttonOnClick(3)" class="button">我想增检</Button></Col>
            <Col span="12"><Button type="warning" @click="buttonOnClick(4)" class="button">终止体检</Button></Col>
          </Row>
        </GridItem>
      </Grid>
    </span>
  </div>


   <!--Modal确认框-->
   <Modal 
      v-model="state.info.modal"
      :title=state.info.button_status
      @on-ok="onConfirm()"
      @on-cancel="state.info.modal=false">
      <b>您确定需要执行该请求？这会导致您需要重排当前队伍。</b>
  </Modal>

  <Modal
      v-model="state.info.modal2"
      title="详情"
      @on-ok="state.info.modal2 = false"
      @on-cancel="state.info.modal2 = false">
      <b>各科室叫号情况</b><br>
      <Row>
          <Col span="12" class="first">科室</Col>
          <Col span="12" class="first">当前叫号</Col>
      </Row>
      <Row v-for="(i, index) in state.info.list">
          <Col span="12" class="first">{{ i.name }}</Col>
          <Col span="12" class="first">{{ i.number }}</Col>
      </Row>
  </Modal>

</template>


<style lang="scss" scoped>
.text{
  font-size: 25px;
  text-align:center;
  color: blue;
  font-weight:bolder;
  margin: auto;
}
.queue{
  font-size: 25px;
  text-align:center;
  color: red;
  font-weight:bolder;
  margin: auto;
}
.info{
  text-align:center;
  font-size: 20px;
}
.button{
  width:150px;
  height:40px;
  font-size: 90%;
}
.icon{
  text-align: center;
  margin: auto;
  font-size: 20px;
}
.span{
  text-align: center;
  margin: auto;
}
.first {
  font-size: 15px;
  padding-left: 5px;
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
</style>
