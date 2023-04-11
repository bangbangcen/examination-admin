<script setup lang="ts">
import { onMounted, reactive, computed, watch, ref } from "vue";
import { cloneDeep } from "lodash";
import { allEl, elChildren, traverse, flatTree, swap } from "../../utils/index.ts";
import type { Column, Row } from "./model";
import MyTableRow from "@/components/MyTable/MyTableRow.vue";

const props = defineProps<{
  columns: Array<Column>;
  data: Array<Row>;
  fit?: boolean;
  edit?: boolean;
  orderBy?: string;
}>();
const { columns, fit = true, orderBy } = props;
let data = props.data;
let tableRowDoms: any = null;
const slotColumns = computed(() => {
  return props.columns.filter((col) => col.slot);
});

function setProps() {
  traverse(data, (row: any) => {
    row.expand = false;
    row.hasChild = Boolean(row.children && row.children.length);
  });
}
watch(
  () => props.edit,
  (newValue) => {
    // 遍历树，赋一些涉及展开的属性
    setProps();
  },
  {
    immediate: true,
  }
);

watch(
  () => props.data,
  () => {
    data = props.data;
    setProps();
  }
);
onMounted(() => {
  tableRowDoms = allEl(".table-row");
  setTableHeadStyle();
  setTableRowStyle();
  setTableRowDragProp();
});

let preDraggedDom: any = null;
let preDraggedNode: any = null;
let curDraggedDom: any = null;
let curDraggedNode: any = null;
let curArr: any = null; //正在拖拽的node所在数组

// 设置表格头的flex
function setTableHeadStyle() {
  elChildren(".table-head").forEach((child: any, index: number) => {
    child.style.flex = `${columns[index].flex}`;
  });
}

// 设置每列的flex以及缩进,将node挂载到对应dom上
function setTableRowStyle() {
  tableRowDoms = allEl(".table-row");
  const nodeList = flatTree(data); //将树摊平成数组的同时，将node所在的数组以及node层级挂载到node
  tableRowDoms.forEach((row: any, index: number) => {
    const rowItems = [...row.children];
    const indentBlock = rowItems[0].children[0];
    const node = nodeList[index];
    row.node = node;
    indentBlock.style.width = `${node.level * 14 + (node.hasChild ? 0 : 14)}px`;
    rowItems.forEach((item: any, index: number) => {
      item.style.flex = `${columns[index].flex}`;
    });
  });
}

function setTableRowDragProp() {
  tableRowDoms.forEach((row: any, index: number) => {
    if (!row.draggable) {
      setDragProp(row);
    }
  });
}

// 为dom设置dragstart,dragenter
function setDragProp(dom: any) {
  // dom.draggable = true;
  dom.addEventListener("dragstart", (event: any) => {
    curArr = event.target.node.arr;
    preDraggedNode = event.target.node;
    preDraggedDom = event.target;
  });
  dom.addEventListener("dragenter", (event: any) => {
    curDraggedDom = event.target;
    curDraggedNode = curDraggedDom.node;
    if (
      !curDraggedNode ||
      preDraggedDom === curDraggedDom ||
      !curArr.includes(preDraggedNode)
    )
      return;
    swapTwoRows();
    setTimeout(() => {
      tableRowDoms = allEl(".table-row");
      setTableRowStyle();
      setTableRowDragProp();
    });
  });
}

function swapTwoRows() {
  const preIndex = curArr.indexOf(preDraggedNode);
  const curIndex = curArr.indexOf(curDraggedNode);
  swap(preDraggedNode, curDraggedNode, orderBy);
  curArr[preIndex] = curDraggedNode;
  curArr[curIndex] = preDraggedNode;
}

defineExpose({
  setTableRowStyle,
  setProps,
});
</script>

<template>
  <table :class="{ fit: fit }">
    <thead>
      <tr class="table-head">
        <th v-for="column in columns">
          {{ column.title }}
        </th>
      </tr>
    </thead>
    <tbody>
      <MyTableRow
        class="table-row"
        v-for="(row, index) in props.data"
        :columns="columns"
        :row="row"
        :edit="props.edit"
        :level="0"
        :slotColumns="slotColumns"
      >
        <template v-for="item in slotColumns" v-slot:[item.slot]="{ row, index }">
          <slot :name="item.slot" v-bind="{ row, index }"></slot>
        </template>
      </MyTableRow>
    </tbody>
  </table>
</template>

<style lang="scss" scoped>
@import "../../assets/theme.scss";

.fit {
  width: 100%;
}

.table-head {
  background-color: $background;

  th {
    text-align: left;
  }
}

.table-row:hover {
  background-color: #f4fdff;
}
</style>
