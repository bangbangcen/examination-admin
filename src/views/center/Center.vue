<script setup lang="ts">
import $axios from "@/axios";
import { forEach } from "lodash";
import { ref, reactive} from "vue";
//import { Permission } from "@/model";
//const { proxy } = getCurrentInstance() as any;

const columns = [
  {
    title: "体检机构名称",
    key: "name",
  },
  {
    title: "区县",
    key: "districtId",
    filters:[
      {
        label: '黄浦区',
        value: '黄浦区'
      },
      {
        label: '徐汇区',
        value: '徐汇区'
      },
      {
        label: '长宁区',
        value: '长宁区'
      },
      {
        label: '静安区',
        value: '静安区'
      },
      {
        label: '普陀区',
        value: '普陀区'
      },
      {
        label: '虹口区',
        value: '虹口区'
      },
      {
        label: '杨浦区',
        value: '杨浦区'
      },
      {
        label: '闵行区',
        value: '闵行区'
      },
      {
        label: '宝山区',
        value: '宝山区'
      },
      {
        label: '嘉定区',
        value: '嘉定区'
      },
      {
        label: '浦东新区',
        value: '浦东新区'
      },
      {
        label: '金山区',
        value: '金山区'
      },
      {
        label: '松江区',
        value: '松江区'
      },
      {
        label: '青浦区',
        value: '青浦区'
      },
      {
        label: '奉贤区',
        value: '奉贤区'
      },
      {
        label: '崇明区',
        value: '崇明区'
      },
    ],
    filterMethod (value: any, row: any) {
    return row.districtId.indexOf(value) > -1;
    }
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
    key: "morningLimit",
  },
  {
    title: "下午日渐人数限制",
    key: "afternoonLimit",
  },
  {
    title: "操作",
    slot: "operation",
  },
];
let res = await $axios.get("examination_center/list");
let data = res.data;
const state = reactive({info: {name:'',},});

async function del(cname:string) {
  state.info.name=cname;
  await $axios.post("examination_center/del",state.info);
}

</script>

<template>
  <div>
    <Input search enter-button="Search" placeholder="Enter something..." />
    <Table
      class="table"
      :columns="columns"
      :data="data"
    >
    <template #operation="{ row, index }">
        <div class="operation">
          <Button type="error"  @click="del(row.name)">
            <Icon type="md-trash" size="18" />
          </Button>
        </div>
    </template>
    </Table>
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
