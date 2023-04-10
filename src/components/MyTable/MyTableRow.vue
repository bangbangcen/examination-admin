<script setup lang="ts">
import { ref } from "vue";
import type { Column, Row } from "./model";

const props = defineProps<{
  columns: Array<Column>;
  row: Row;
  edit?: boolean;
  level?: number;
  slotColumns?: Array<Column>;
}>();
const { columns, level = 0, slotColumns } = props;

function clickArrow(expand: boolean) {
  props.row.expand = expand;
}
</script>

<template>
  <tr class="table-row">
    <td v-for="(column, index) in columns">
      <div v-if="index === 0" class="indent"></div>
      <template v-if="props.row.hasChild && index === 0">
        <Icon
          class="icon"
          v-if="props.row.expand"
          type="ios-arrow-down"
          @click="clickArrow(false)"
        />
        <Icon
          class="icon"
          v-if="!props.row.expand"
          type="ios-arrow-forward"
          @click="clickArrow(true)"
        />
        
      </template>
      <template v-if="column.slot">
        <slot :name="column.slot" v-bind="{ row, index }"></slot>
      </template>
      <template v-else>
        <template v-if="!props.edit || !column.editable">
          {{ props.row[column.key] }}
        </template>
        <template v-else>
          <Input class="input" v-model="props.row[column.key]"></Input>
        </template>
      </template>
    </td>
  </tr>
  <div v-show="props.row.expand && props.row.hasChild">
    <template v-for="_row in props.row.children">
      <MyTableRow
        class="table-row"
        :columns="columns"
        :row="_row"
        :edit="props.edit"
        :level="level + 1"
        :slotColumns="slotColumns"
      >
        <template
          v-for="item in slotColumns"
          v-slot:[item.slot]="{ index, row }"
        >
          <slot :name="item.slot" v-bind="{ row, index }"></slot>
        </template>
      </MyTableRow>
    </template>
  </div>
</template>

<style lang="scss">
@import "../../assets/theme.scss";

.table-row:hover {
  background-color: #f4fdff;
}

.indent {
  display: inline-block;
}

tr {
  display: flex;
  align-items: center;
  height: 46px;
  padding-left: 18px;
  border-bottom: 1px solid $border;
  transition: all 0.4s ease;

  .td {
    .input {
      width: 80%;
    }
  }
}

.icon {
  color: $sub-color;
}

.icon:hover {
  cursor: pointer;
}

.input {
  width: 80%;
}
</style>
